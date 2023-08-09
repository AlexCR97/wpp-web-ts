export interface ReadyHandler {
  onReady(): Promise<void>;
}
