import * as vscode from "vscode";
import { getNonce } from "../utils/nonce";

interface WebviewResourceUris {
  styleUri: vscode.Uri;
  configScriptUri: vscode.Uri;
  formatterScriptUri: vscode.Uri;
  chatScriptUri: vscode.Uri;
  mainScriptUri: vscode.Uri;
}

function getResourceUris(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): WebviewResourceUris {
  const asset = (...path: string[]) =>
    webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, "assets", ...path));

  return {
    styleUri: asset("styles", "chat.css"),
    configScriptUri: asset("js", "config.js"),
    formatterScriptUri: asset("js", "messageFormatter.js"),
    chatScriptUri: asset("js", "chatController.js"),
    mainScriptUri: asset("js", "main.js"),
  };
}

export function getChatWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri
): string {
  const nonce = getNonce();
  const {
    styleUri,
    configScriptUri,
    formatterScriptUri,
    chatScriptUri,
    mainScriptUri,
  } = getResourceUris(webview, extensionUri);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <link rel="stylesheet" href="${styleUri}">
</head>
<body>
  <header id="header">
    <h3>AI Coding Assistant</h3>
    <button id="settings-btn" type="button" aria-label="Settings">⚙️</button>
  </header>

  <div id="popup-notification" role="status" aria-live="polite"></div>

  <div id="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
    <div id="settings-content">
      <h3 id="settings-title">Study Mode</h3>
      <div class="setting-group">
        <label for="model-select">Interface Condition</label>
        <select id="model-select">
          <option value="1">Mode 1: Baseline</option>
          <option value="2">Mode 2: Skeleton Code</option>
          <option value="3">Mode 3: Popup Warning</option>
          <option value="4">Mode 4: Security Highlight</option>
          <option value="5">Mode 5: Full Security Panel</option>
        </select>
      </div>
      <div id="settings-buttons">
        <button id="cancel-settings" type="button">Cancel</button>
        <button id="save-settings" type="button">Save</button>
      </div>
    </div>
  </div>

  <main id="chat-container">
    <div id="welcome-screen">
      <div class="bot-icon" aria-hidden="true">🤖</div>
      <h2>Welcome</h2>
      <p>Describe the Python code you want to generate.</p>
      <p class="welcome-hint">Example: Generate an encrypt function using AES.new</p>
    </div>
  </main>

  <footer id="input-container">
    <input type="text" id="user-input" placeholder="Type your message..." autocomplete="off">
    <button id="send-button" type="button">Send</button>
  </footer>

  <script nonce="${nonce}" src="${configScriptUri}"></script>
  <script nonce="${nonce}" src="${formatterScriptUri}"></script>
  <script nonce="${nonce}" src="${chatScriptUri}"></script>
  <script nonce="${nonce}" src="${mainScriptUri}"></script>
</body>
</html>`;
}
