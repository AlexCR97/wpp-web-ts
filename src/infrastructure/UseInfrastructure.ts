import { messageSenderToken } from "@/application/services/messages";
import { Container, ContainerSetupFactory, ContainerSetupFunction } from "@tomasjs/core";
import { MessageSender } from "./services/messages";
import {
  NinjaQuotesApi,
  PaperQuotesApi,
  QuotableApi,
  QuotesApi,
  TheySaidSoApi,
} from "./services/quotes-apis";
import { useWhatsAppWeb } from "./services/wpp";
import { env } from "@/env";
import { UseSchedule } from "@/common/node-cron";
import { MySchedule } from "@/application/services/schedules";

export class UseInfrastructure implements ContainerSetupFactory {
  create(): ContainerSetupFunction {
    return async (container) => {
      // quotes-apis
      container
        .addClass(NinjaQuotesApi)
        .addClass(PaperQuotesApi)
        .addClass(QuotableApi)
        .addClass(TheySaidSoApi);

      container.addClass(QuotesApi);

      if (env.entryPoint === "schedule") {
        await this.setScheduleAsEntryPoint(container);
      } else if (env.entryPoint === "wpp") {
        container.addClass(MessageSender, { token: messageSenderToken });
        await this.setWppAsEntryPointAsync(container);
      }
    };
  }

  private async setScheduleAsEntryPoint(container: Container) {
    const useSchedule = new UseSchedule({
      cronExpression: env.schedule.cron,
      schedule: MySchedule,
      runOnInit: env.schedule.runOnInit,
    });

    const setupFunction = useSchedule.create();
    await setupFunction(container);
  }

  private async setWppAsEntryPointAsync(container: Container) {
    const setupFunction = useWhatsAppWeb.create();
    await setupFunction(container);
  }
}
