import "reflect-metadata";
import { ServiceContainerBuilder } from "@tomasjs/core";
import { TomasLoggerFactory } from "@tomasjs/logging";
import { UseInfrastructure } from "./infrastructure";

async function main() {
  const logger = new TomasLoggerFactory().create(main.name, "debug");

  logger.debug("Building services...");

  await new ServiceContainerBuilder().setup(new UseInfrastructure()).buildServiceProviderAsync();

  logger.debug("Services built!");
}

main();
