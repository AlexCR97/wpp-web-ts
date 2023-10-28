import { TokenBuilder } from "@tomasjs/core/tokens";

export const emailSenderToken = new TokenBuilder().with("wpp-web-ts").with("EmailSender").build();

export interface EmailSender {
  send(htmlContent: string): Promise<void>;
}
