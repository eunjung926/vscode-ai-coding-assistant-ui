import * as vscode from "vscode";
import { getChatWebviewHtml } from "../templates/chatWebviewHtml";
import { getSecurityWarningHtml } from "../templates/securityWarningHtml";
import { WebviewMessage } from "../types/webviewMessages";

export class ChatSidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "aiCodingAssistant.chatView";

  private _view?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = getChatWebviewHtml(
      webviewView.webview,
      this.extensionUri
    );

    webviewView.webview.onDidReceiveMessage((message: WebviewMessage) => {
      this.handleWebviewMessage(message);
    });
  }

  clearChat(): void {
    this._view?.webview.postMessage({ command: "clearChat" });
  }

  private handleWebviewMessage(message: WebviewMessage): void {
    switch (message.command) {
      case "showWarning":
        if (message.text) {
          vscode.window.showWarningMessage(message.text);
        }
        break;
      case "showBigWarning":
        this.openSecurityWarningPanel();
        break;
    }
  }

  private openSecurityWarningPanel(): void {
    const panel = vscode.window.createWebviewPanel(
      "securityWarning",
      "Security Warning",
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    panel.webview.html = getSecurityWarningHtml();

    panel.webview.onDidReceiveMessage((message: { command: string }) => {
      if (message.command === "close") {
        panel.dispose();
      }
    });
  }
}
