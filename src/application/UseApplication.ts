import { ContainerSetupFunction } from "@tomasjs/core";
import { UseEvents } from "@tomasjs/cqrs";
import { QuoteSentEventHandler } from "./QuoteSentEvent";

export const useApplication: ContainerSetupFunction = async (container) => {
  await new UseEvents([QuoteSentEventHandler]).create()(container);
};
