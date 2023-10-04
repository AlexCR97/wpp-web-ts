import { QrHandler } from "@/common/whatsapp-web/events";
import { TomasLogger, injectable } from "@tomasjs/core";
import qrcode from "qrcode-terminal";

@injectable()
export class MyQrHandler implements QrHandler {
  private readonly logger = new TomasLogger(MyQrHandler.name, "debug");

  async onQr(qr: string): Promise<void> {
    this.logger.debug("qr:", qr);
    qrcode.generate(qr, { small: true });
  }
}
