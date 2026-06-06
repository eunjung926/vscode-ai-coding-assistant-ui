import * as vscode from "vscode";
import { ChatSidebarProvider } from "./providers/chatSidebarProvider";

export function activate(context: vscode.ExtensionContext): void {
  const provider = new ChatSidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      ChatSidebarProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("aiCodingAssistant.clearChat", () => {
      provider.clearChat();
    })
  );
}

export function deactivate(): void {}
