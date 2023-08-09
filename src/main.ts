import "reflect-metadata";
import { ServiceContainerBuilder, ServiceProvider } from "@tomasjs/core";
import { TomasLoggerFactory } from "@tomasjs/logging";
import { UseInfrastructure } from "./infrastructure";
import { QuotesApi } from "./infrastructure/services/quotes-apis";

async function main() {
  const logger = new TomasLoggerFactory().create(main.name, "debug");

  logger.debug("Building services...");

  const services = await new ServiceContainerBuilder()
    .setup(new UseInfrastructure())
    .buildServiceProviderAsync();

  await test(services);

  logger.debug("Services built!");
}

// TODO Delete this function
async function test(services: ServiceProvider) {
  const quotesApi = services.get(QuotesApi);
  const randomQuote = await quotesApi.getRandomQuoteAsync();
  console.log("randomQuote", randomQuote);
}

main();
