import { Schedule } from "@/common/node-cron";
import { QuotesApi } from "@/infrastructure/services/quotes-apis";
import { TomasLogger, inject, injectable } from "@tomasjs/core";

@injectable()
export class MySchedule implements Schedule {
  private readonly logger = new TomasLogger(MySchedule.name, "debug");

  constructor(@inject(QuotesApi) private readonly quotesApi: QuotesApi) {}

  async run(now: Date | "manual" | "init"): Promise<void> {
    this.logger.debug("Fetching random quote from external api...");
    const { author, quote } = await this.quotesApi.getRandomQuoteAsync();
    const message = `"${quote}" - ${author}`;
    this.logger.debug(`Fetched quote: ${message}`);
    console.log("");
  }
}
