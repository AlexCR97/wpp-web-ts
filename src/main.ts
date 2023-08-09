import "reflect-metadata";
import { ServiceContainerBuilder } from "@tomasjs/core";
import { TomasLoggerFactory } from "@tomasjs/logging";
import { useWhatsAppWeb } from "./application/services/wpp";
import { MessageSender } from "./application/services/MessageSender";
import { NinjaQuotesApi } from "./infrastructure/quotes-apis";

async function main() {
  const logger = new TomasLoggerFactory().create(main.name, "debug");

  logger.debug("Building services...");

  await new ServiceContainerBuilder()
    .addClass(MessageSender)
    .addClass(NinjaQuotesApi)
    .setup(useWhatsAppWeb)
    .buildServiceProviderAsync();

  logger.debug("Services built!");
}

main();
