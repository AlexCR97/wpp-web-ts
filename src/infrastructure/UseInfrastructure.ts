import { messageSenderToken } from "@/application/services/messages";
import {
  Container,
  ContainerSetupFactory,
  ContainerSetupFunction,
  TomasLogger,
} from "@tomasjs/core";
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
import { emailSenderToken } from "@/application";
import { BrevoApi, BrevoEmailSender } from "./brevo";

export class UseInfrastructure implements ContainerSetupFactory {
  private readonly logger = new TomasLogger(UseInfrastructure.name, "debug");

  create(): ContainerSetupFunction {
    return async (container) => {
      this.addQuotesApi(container);
      this.addBrevo(container);
      container.addClass(MessageSender, { token: messageSenderToken });
      await this.addEntryPoint(container);
    };
  }

  private addQuotesApi(container: Container) {
    container
      .addClass(NinjaQuotesApi)
      .addClass(PaperQuotesApi)
      .addClass(QuotableApi)
      .addClass(TheySaidSoApi);

    container.addClass(QuotesApi);
  }

  private addBrevo(container: Container) {
    container.addClass(BrevoApi).addClass(BrevoEmailSender, { token: emailSenderToken });
  }

  private async addEntryPoint(container: Container) {
    if (env.entryPoint === "schedule") {
      await this.setScheduleAsEntryPoint(container);
    } else if (env.entryPoint === "wpp") {
      await this.setWppAsEntryPointAsync(container);
    }
  }

  private async setScheduleAsEntryPoint(container: Container) {
    this.logger.debug("Schedule will be set as entry point");

    await new UseSchedule({
      cronExpression: env.schedule.cron,
      schedule: MySchedule,
      runOnInit: env.schedule.runOnInit,
    }).create()(container);
  }

  private async setWppAsEntryPointAsync(container: Container) {
    this.logger.debug("Wpp will be set as entry point");
    await useWhatsAppWeb.create()(container);
  }
}
