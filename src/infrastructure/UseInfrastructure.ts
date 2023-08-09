import { ContainerSetupFactory, ContainerSetupFunction } from "@tomasjs/core";
import { MessageSender } from "./services/messages";
import { messageSenderToken } from "@/application/services/messages";
import { NinjaQuotesApi } from "./services/quotes-apis";
import { useWhatsAppWeb } from "./services/wpp";

export class UseInfrastructure implements ContainerSetupFactory {
  create(): ContainerSetupFunction {
    return async (container) => {
      // messages
      container.addClass(MessageSender, { token: messageSenderToken });

      // quotes-apis
      container.addClass(NinjaQuotesApi);

      // wpp
      const setupFunction = useWhatsAppWeb.create();
      await setupFunction(container);
    };
  }
}
