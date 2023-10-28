import { ContainerSetupFunction } from "@tomasjs/core";
import { UseEvents } from "@tomasjs/cqrs";
import { ErrorOccurredEventHandler } from "./ErrorOccurredEvent";
import { QuoteSentEventHandler } from "./QuoteSentEvent";

export const useApplication: ContainerSetupFunction = async (container) => {
  await new UseEvents([ErrorOccurredEventHandler, QuoteSentEventHandler]).create()(container);
};
