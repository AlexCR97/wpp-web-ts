import { Client } from "whatsapp-web.js";
import { AuthenticatedHandler, QrHandler, ReadyHandler } from "./events";
import { ClassConstructor, Logger } from "@tomasjs/core";

export interface UseWhatsAppWebOptions {
  client: Client;
  logger?: Logger;
  on?: {
    authenticated?: ClassConstructor<AuthenticatedHandler>;
    qr?: ClassConstructor<QrHandler>;
    ready?: ClassConstructor<ReadyHandler>;
  };
}
