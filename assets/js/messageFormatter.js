const PYTHON_KEYWORDS = [
  "if", "elif", "else", "for", "while", "def", "class", "return",
  "import", "from", "as", "try", "except", "finally", "with",
  "lambda", "yield", "pass", "break", "continue", "raise", "in", "is",
  "not", "and", "or", "True", "False", "None", "async", "await",
];

const PYTHON_BUILTINS = [
  "print", "len", "range", "str", "int", "float", "list", "dict",
  "set", "tuple", "open", "input", "type", "isinstance", "enumerate",
  "zip", "map", "filter", "sorted", "sum", "max", "min",
];

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function highlightPython(code) {
  let highlighted = escapeHtml(code);

  highlighted = highlighted.replace(
    /#.*/g,
    '<span style="color: #5c6370; font-style: italic;">$&</span>'
  );

  highlighted = highlighted.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span style="color: #d19a66;">$&</span>'
  );

  for (const keyword of PYTHON_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    highlighted = highlighted.replace(
      regex,
      '<span style="color: #c678dd; font-weight: bold;">$&</span>'
    );
  }

  for (const builtin of PYTHON_BUILTINS) {
    const regex = new RegExp(`\\b${builtin}(?=\\()`, "g");
    highlighted = highlighted.replace(
      regex,
      '<span style="color: #61afef;">$&</span>'
    );
  }

  return highlighted;
}

function highlightLine(line, language) {
  if (language === "python" || language === "py") {
    return highlightPython(line);
  }
  return escapeHtml(line);
}

function lineHasSecurityKeyword(line, keywords) {
  if (!keywords?.length) {
    return false;
  }

  const lowerLine = line.toLowerCase();
  return keywords.some((keyword) => lowerLine.includes(keyword.toLowerCase()));
}

function wrapSecurityHighlight(highlightedLine) {
  return `<span class="security-highlight">${highlightedLine}</span>`;
}

function buildCodeBlockHtml(language, trimmedCode, modeConfig) {
  const base64Code = btoa(unescape(encodeURIComponent(trimmedCode)));
  const lines = trimmedCode.split("\n");

  const highlightedLines = lines.map((line) => {
    const highlighted = highlightLine(line, language);
    if (lineHasSecurityKeyword(line, modeConfig.securityKeywords)) {
      return wrapSecurityHighlight(highlighted);
    }
    return highlighted;
  });

  return (
    `<div class="code-block" data-code-base64="${base64Code}">` +
    `<div class="code-header">` +
    `<div class="code-lang">${language}</div>` +
    `<button type="button" class="code-btn" onclick="copyCode(this)" title="Copy code">` +
    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">` +
    `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>` +
    `<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>` +
    `</svg>copy</button></div>` +
    `<pre><code>${highlightedLines.join("\n")}</code></pre></div>`
  );
}

function formatMessage(message, modeId) {
  const modeConfig = STUDY_MODES[modeId];
  let formatted = message;
  const codeBlocks = [];
  let codeBlockIndex = 0;

  formatted = formatted.replace(/```(\w*)\n?([\s\S]*?)```/g, (_match, lang, code) => {
    const language = lang || "python";
    const placeholder = `___CODEBLOCK_${codeBlockIndex}___`;
    codeBlocks.push(buildCodeBlockHtml(language, code.trim(), modeConfig));
    codeBlockIndex += 1;
    return placeholder;
  });

  formatted = formatted.replace(
    /`([^`]+)`/g,
    (_match, code) => `<span class="inline-code">${escapeHtml(code)}</span>`
  );

  formatted = formatted.replace(/\n/g, "<br>");

  codeBlocks.forEach((block, index) => {
    formatted = formatted.replace(`___CODEBLOCK_${index}___`, block);
  });

  return formatted;
}

function copyCode(button) {
  const codeBlock = button.closest(".code-block");
  const base64Code = codeBlock?.getAttribute("data-code-base64");

  if (!base64Code) {
    return;
  }

  try {
    const originalCode = decodeURIComponent(escape(atob(base64Code)));
    navigator.clipboard.writeText(originalCode).then(() => {
      const originalHtml = button.innerHTML;
      button.textContent = "Copied";
      button.style.color = "#4caf50";

      setTimeout(() => {
        button.innerHTML = originalHtml;
        button.style.color = "";
      }, 2000);
    });
  } catch (error) {
    console.error("Failed to copy code:", error);
  }
}

window.copyCode = copyCode;
