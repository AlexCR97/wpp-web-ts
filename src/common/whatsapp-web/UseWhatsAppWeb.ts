import {
  ClassConstructor,
  Container,
  ContainerSetupFactory,
  ContainerSetupFunction,
} from "@tomasjs/core";
import { Logger, TomasLogger } from "@tomasjs/logging";
import { Client } from "whatsapp-web.js";
import { UseWhatsAppWebOptions } from "./UseWhatsAppWebOptions";
import { AuthenticatedHandler, QrHandler, ReadyHandler } from "./events";

export class UseWhatsAppWeb implements ContainerSetupFactory {
  private readonly client: Client;
  private readonly logger: Logger;
  private readonly authenticatedHandler?: ClassConstructor<AuthenticatedHandler>;
  private readonly qrHandler?: ClassConstructor<QrHandler>;
  private readonly readyHandler?: ClassConstructor<ReadyHandler>;

  constructor(options: UseWhatsAppWebOptions) {
    this.client = options.client;
    this.logger = options.logger ?? new TomasLogger(UseWhatsAppWeb.name, "debug");
    this.authenticatedHandler = options.on?.authenticated;
    this.qrHandler = options.on?.qr;
    this.readyHandler = options.on?.ready;
  }

  create(): ContainerSetupFunction {
    return (container) => {
      this.logger.debug("Registering client...");
      container.addInstance(this.client, Client);

      this.logger.debug("Registering event handlers...");
      this.tryBindQrHandler(container);
      this.tryBindAuthenticatedHandler(container);
      this.tryBindReadyHandler(container);

      this.logger.debug("Initializing client...");
      this.client.initialize();
    };
  }

  private tryBindQrHandler(container: Container) {
    if (this.qrHandler === undefined) {
      return;
    }

    container.addClass(this.qrHandler);

    this.client.on("qr", async (qr) => {
      const handler = container.get<QrHandler>(this.qrHandler!);
      await handler.onQr(qr);
    });
  }

  private tryBindAuthenticatedHandler(container: Container) {
    if (this.authenticatedHandler === undefined) {
      return;
    }

    container.addClass(this.authenticatedHandler);

    this.client.on("authenticated", async (session) => {
      const handler = container.get<AuthenticatedHandler>(this.authenticatedHandler!);
      await handler.onAuthenticated(session);
    });
  }

  private tryBindReadyHandler(container: Container) {
    if (this.readyHandler === undefined) {
      return;
    }

    container.addClass(this.readyHandler);

    this.client.on("ready", async () => {
      const handler = container.get<ReadyHandler>(this.readyHandler!);
      await handler.onReady();
      // this.logger.debug("ready");
      // this.logger.debug("loading chat...");
      // const myLoveChat = await this.client.getChatById("5218311027292@c.us");
      // this.logger.debug("myLoveChat", myLoveChat);
    });
  }
}
