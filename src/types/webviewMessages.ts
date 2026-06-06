export type WebviewCommand =
  | "showWarning"
  | "showBigWarning"
  | "clearChat";

export interface WebviewMessage {
  command: WebviewCommand;
  text?: string;
}
