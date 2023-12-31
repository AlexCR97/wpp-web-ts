import { UseWhatsAppWeb } from "@/common/whatsapp-web";
import { Client, LocalAuth } from "whatsapp-web.js";
import { MyQrHandler } from "./MyQrHandler";
import { MyReadyHandler } from "./MyReadyHandler";

export const useWhatsAppWeb = new UseWhatsAppWeb({
  client: new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  }),
  on: {
    qr: MyQrHandler,
    ready: MyReadyHandler,
  },
});
