import { ReadyHandler } from "@/common/whatsapp-web/events";
import { MessageSender } from "@/application/services/MessageSender";
import { inject, injectable } from "@tomasjs/core";
import { TomasLogger } from "@tomasjs/logging";
import cron from "node-cron";

@injectable()
export class MyReadyHandler implements ReadyHandler {
  private readonly logger = new TomasLogger(MyReadyHandler.name, "debug");

  constructor(@inject(MessageSender) private readonly messageSender: MessageSender) {}

  async onReady(): Promise<void> {
    this.logger.debug("ready");
    this.scheduleCronTask();
  }

  private scheduleCronTask() {
    // TODO How to schedule with DI?
    cron.schedule(
      "* * * * *", // TODO Make this configurable
      (now) => {
        this.logger.debug(`Cron job triggered at ${now.toString()}`);
        console.log("");
        this.messageSender.sendAsync();
      },
      {
        runOnInit: true, // TODO Make this configurable
      }
    );
  }
}
