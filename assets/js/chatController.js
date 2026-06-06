const vscode = acquireVsCodeApi();

class ChatController {
  constructor() {
    this.currentMode = "1";
    this.elements = {
      chatContainer: document.getElementById("chat-container"),
      welcomeScreen: document.getElementById("welcome-screen"),
      userInput: document.getElementById("user-input"),
      sendButton: document.getElementById("send-button"),
      settingsBtn: document.getElementById("settings-btn"),
      settingsModal: document.getElementById("settings-modal"),
      modelSelect: document.getElementById("model-select"),
      saveSettingsBtn: document.getElementById("save-settings"),
      cancelSettingsBtn: document.getElementById("cancel-settings"),
      popupNotification: document.getElementById("popup-notification"),
    };
  }

  init() {
    this.bindEvents();
    this.elements.userInput?.focus();
  }

  bindEvents() {
    const {
      sendButton,
      userInput,
      settingsBtn,
      settingsModal,
      saveSettingsBtn,
      cancelSettingsBtn,
      modelSelect,
    } = this.elements;

    sendButton?.addEventListener("click", () => this.sendMessage());
    userInput?.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        this.sendMessage();
      }
    });

    settingsBtn?.addEventListener("click", () => {
      settingsModal?.classList.add("show");
      if (modelSelect) {
        modelSelect.value = this.currentMode;
      }
    });

    cancelSettingsBtn?.addEventListener("click", () => {
      settingsModal?.classList.remove("show");
    });

    saveSettingsBtn?.addEventListener("click", () => {
      if (modelSelect) {
        this.currentMode = modelSelect.value;
      }
      settingsModal?.classList.remove("show");
      const mode = STUDY_MODES[this.currentMode];
      this.showToast(`Mode changed to: ${mode.name}`);
    });

    settingsModal?.addEventListener("click", (event) => {
      if (event.target === settingsModal) {
        settingsModal.classList.remove("show");
      }
    });

    window.addEventListener("message", (event) => {
      if (event.data?.command === "clearChat") {
        this.clearChat();
      }
    });
  }

  clearChat() {
    const { chatContainer } = this.elements;
    if (!chatContainer) {
      return;
    }

    chatContainer.innerHTML = `
      <div id="welcome-screen">
        <div class="bot-icon" aria-hidden="true">🤖</div>
        <h2>Welcome</h2>
        <p>Describe the Python code you want to generate.</p>
        <p class="welcome-hint">Example: Generate an encrypt function using AES.new</p>
      </div>`;
    this.elements.welcomeScreen = document.getElementById("welcome-screen");
  }

  showToast(message) {
    const { popupNotification } = this.elements;
    if (!popupNotification) {
      return;
    }

    popupNotification.textContent = message;
    popupNotification.classList.add("show");
    setTimeout(() => popupNotification.classList.remove("show"), 1500);
  }

  addMessage(text, isUser) {
    const { chatContainer, welcomeScreen } = this.elements;
    if (!chatContainer) {
      return null;
    }

    welcomeScreen?.remove();

    const messageDiv = document.createElement("div");
    messageDiv.className = isUser ? "message user-message" : "message bot-message";
    messageDiv.innerHTML = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageDiv;
  }

  updateBotMessage(element, text, isFinal = false) {
    if (!element) {
      return;
    }

    let displayText = text;
    if (!displayText.includes("```")) {
      displayText = `\`\`\`python\n${displayText}`;
    }
    if (!displayText.endsWith("```")) {
      displayText += isFinal ? "\n```" : "\n```";
    }

    element.innerHTML = formatMessage(displayText, this.currentMode);
    this.elements.chatContainer.scrollTop =
      this.elements.chatContainer.scrollHeight;
  }

  async sendMessage() {
    const { userInput } = this.elements;
    const text = userInput?.value.trim();

    if (!text) {
      return;
    }

    this.addMessage(escapeHtml(text), true);
    userInput.value = "";
    await this.fetchStreamingResponse(text);
  }

  async fetchStreamingResponse(message) {
    const mode = STUDY_MODES[this.currentMode];
    const botMessage = this.addMessage("Generating...", false);
    let response = "";

    try {
      const apiUrl = `${API_BASE_URL}${mode.endpoint}/stream`;
      const fullUrl = `${apiUrl}?input=${encodeURIComponent(TASK_PREFIX + message)}`;

      const res = await fetch(fullUrl, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      botMessage.innerHTML = "";

      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) {
            continue;
          }

          const dataContent = line.slice(6).trim();
          if (!dataContent || dataContent.startsWith(":")) {
            continue;
          }

          try {
            const jsonData = JSON.parse(dataContent);

            if (jsonData.error) {
              throw new Error(jsonData.error);
            }
            if (jsonData.done) {
              break;
            }
            if (jsonData.token) {
              response += jsonData.token;
              this.updateBotMessage(botMessage, response);
            }
          } catch (parseError) {
            console.error("Failed to parse SSE chunk:", parseError);
          }
        }
      }

      if (response.trim()) {
        this.updateBotMessage(botMessage, response, true);
      } else {
        botMessage.innerHTML = '<span class="warning-text">Empty response received.</span>';
      }

      this.showSecurityFeedback(mode);
    } catch (error) {
      console.error("API request failed:", error);
      botMessage.innerHTML =
        `<span class="error-text">Failed to connect to the API server.<br>` +
        `URL: <strong>${API_BASE_URL}</strong><br>` +
        `Details: ${error.message}</span>`;
    }

    return response;
  }

  showSecurityFeedback(mode) {
    if (mode.popup === "small") {
      vscode.postMessage({ command: "showWarning", text: SECURITY_WARNING_TEXT });
    }
    if (mode.popup === "big") {
      vscode.postMessage({ command: "showBigWarning" });
    }
  }
}

const chatController = new ChatController();
