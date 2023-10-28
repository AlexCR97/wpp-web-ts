import "reflect-metadata";
import { ServiceContainerBuilder, TomasLogger } from "@tomasjs/core";
import { UseInfrastructure } from "./infrastructure";
import { useApplication } from "./application";

async function main() {
  const logger = new TomasLogger("main", "debug");

  logger.debug("Building services...");

  await new ServiceContainerBuilder()
    .setup(useApplication)
    .setup(new UseInfrastructure())
    .buildServiceProviderAsync();

  logger.debug("Services built!");
}

main();
