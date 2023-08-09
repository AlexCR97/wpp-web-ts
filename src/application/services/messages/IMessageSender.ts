export interface IMessageSender {
  sendAsync(): Promise<void>;
}
