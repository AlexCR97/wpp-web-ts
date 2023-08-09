import { randomKey } from "@/common/random";
import { inject, injectable } from "@tomasjs/core";
import { TomasLogger } from "@tomasjs/logging";
import { NinjaQuotesApi } from "./NinjaQuotesApi";
import { PaperQuotesApi } from "./PaperQuotesApi";
import { QuotableApi } from "./QuotableApi";
import { Quote } from "./Quote";

const quoteApiProviders = ["NinjaQuotes", "PaperQuotes", "Quotable"] as const;

type QuoteApiProvider = (typeof quoteApiProviders)[number];

@injectable()
export class QuotesApi {
  private readonly logger = new TomasLogger(QuotesApi.name, "debug");

  constructor(
    @inject(NinjaQuotesApi) private readonly ninjaQuotesApi: NinjaQuotesApi,
    @inject(PaperQuotesApi) private readonly paperQuotesApi: PaperQuotesApi,
    @inject(QuotableApi) private readonly quotableApi: QuotableApi
  ) {}

  async getRandomQuoteAsync(): Promise<Quote> {
    this.logger.debug("Getting random apiProvider...");
    const apiProvider = this.getRandomApiProvider();
    this.logger.debug(`Got apiProvider: ${apiProvider}`);

    if (apiProvider === "NinjaQuotes") {
      return await this.getFromNinjaQuotesApiAsync();
    }

    if (apiProvider === "PaperQuotes") {
      return await this.getFromPaperQuotesApiAsync();
    }

    if (apiProvider === "Quotable") {
      return await this.getFromQuotableApiAsync();
    }

    throw new Error(`Unknown QuoteApiProvider: "${apiProvider}"`);
  }

  private getRandomApiProvider(): QuoteApiProvider {
    return "Quotable"; // TODO Remove this
    // const randomIndex = Math.floor(Math.random() * quoteApiProviders.length);
    // return quoteApiProviders[randomIndex];
  }

  private async getFromNinjaQuotesApiAsync(): Promise<Quote> {
    const response = await this.ninjaQuotesApi.getAsync({
      category: "love",
      limit: "1",
    });

    this.logger.debug(
      `response from ${<QuoteApiProvider>"NinjaQuotes"}: ${JSON.stringify(response)}`
    );

    return {
      author: response[0].author,
      quote: response[0].quote,
    };
  }

  private async getFromPaperQuotesApiAsync(): Promise<Quote> {
    const response = await this.paperQuotesApi.getAsync({
      language: "en",
      limit: 1,
      order: "?",
      random: randomKey(16),
      tags: ["love"],
    });

    this.logger.debug(
      `response from ${<QuoteApiProvider>"PaperQuotes"}: ${JSON.stringify(response)}`
    );

    return {
      author: response.results[0].author,
      quote: response.results[0].quote,
    };
  }

  private async getFromQuotableApiAsync(): Promise<Quote> {
    const tags: string[] = [
      // "faith",
      // "family",
      // "friendship",
      // "generosity",
      // "gratitude",
      "happiness",
      "inspirational",
      // "life",
      "love",
      "motivational",
      "perseverance",
      // "power-quotes",
      // "self-help",
      // "success",
      // "wellness",
      "wisdom",
    ];

    const response = await this.quotableApi.getRandomQuotesAsync({
      limit: 1,
      tags: tags.join("|"),
    });

    this.logger.debug(
      `response from ${<QuoteApiProvider>"PaperQuotes"}: ${JSON.stringify(response)}`
    );

    return {
      author: response[0].author,
      quote: response[0].content,
    };
  }
}
