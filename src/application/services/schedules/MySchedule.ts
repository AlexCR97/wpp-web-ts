import { Schedule } from "@/common/node-cron";
import { TomasLogger, inject, injectable } from "@tomasjs/core";
import { IMessageSender, messageSenderToken } from "../messages";

@injectable()
export class MySchedule implements Schedule {
  private readonly logger = new TomasLogger(MySchedule.name, "debug");

  constructor(@inject(messageSenderToken) private readonly messageSender: IMessageSender) {}

  async run(now: Date | "manual" | "init"): Promise<void> {
    this.logger.debug(`Cron job triggered at ${now.toString()}`);
    await this.messageSender.sendAsync();
  }
}
