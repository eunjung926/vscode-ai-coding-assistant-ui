export function getSecurityWarningHtml(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      padding: 30px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #fff3cd;
    }
    .warning-box {
      background: white;
      border: 2px solid #ffc107;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    h2 { color: #ff6b00; margin-top: 0; }
    p { font-size: 16px; line-height: 1.6; }
    button {
      margin-top: 20px;
      padding: 12px 24px;
      background: #007acc;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="warning-box">
    <h2>⚠️ 보안 경고</h2>
    <p><strong>중요 안내:</strong></p>
    <p>이 코드는 공개된 오픈소스 데이터를 기반으로 자동 생성되었으며, 보안이 완전히 보장되지 않을 수 있습니다.</p>
    <p>서비스 환경에서 사용하기 전에 반드시 코드를 검토하시길 권장드립니다.</p>
    <button onclick="closePanel()">이해했습니다</button>
  </div>
  <script>
    const vscode = acquireVsCodeApi();
    function closePanel() {
      vscode.postMessage({ command: 'close' });
    }
  </script>
</body>
</html>`;
}
