import { ReadyHandler } from "@/common/whatsapp-web/events";
import { TomasLogger, inject, injectable } from "@tomasjs/core";
import cron from "node-cron";
import { env } from "@/env";
import { IMessageSender, messageSenderToken } from "@/application/services/messages";

@injectable()
export class MyReadyHandler implements ReadyHandler {
  private readonly logger = new TomasLogger(MyReadyHandler.name, "debug");

  constructor(@inject(messageSenderToken) private readonly messageSender: IMessageSender) {}

  async onReady(): Promise<void> {
    this.logger.debug("ready");
    this.scheduleCronTask();
  }

  private scheduleCronTask() {
    // TODO How to schedule with DI?
    cron.schedule(
      env.schedule.cron,
      (now) => {
        this.logger.debug(`Cron job triggered at ${now.toString()}`);
        console.log("");
        this.messageSender.sendAsync();
      },
      {
        runOnInit: env.schedule.runOnInit,
      }
    );
  }
}
