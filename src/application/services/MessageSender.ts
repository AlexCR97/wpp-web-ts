import { env } from "@/env";
import { NinjaQuotesApi, Quote } from "@/infrastructure/quotes-apis";
import { inject, injectable } from "@tomasjs/core";
import { TomasLogger } from "@tomasjs/logging";
import { Client } from "whatsapp-web.js";

@injectable()
export class MessageSender {
  private readonly logger = new TomasLogger(MessageSender.name, "debug");

  constructor(
    @inject(Client) private readonly client: Client,
    @inject(NinjaQuotesApi) private readonly ninjaQuotesApi: NinjaQuotesApi
  ) {}

  private get chatId(): string {
    return env.wpp.chatId;
  }

  async sendAsync(): Promise<void> {
    this.logger.debug(`Loading chat with id "${this.chatId}" ...`);
    const chat = await this.client.getChatById(this.chatId);
    this.logger.debug(`Found chat: ${chat.name}`);
    console.log("");

    this.logger.debug("Fetching random quote from external api...");
    const { author, quote } = await this.getRandomQuoteAsync();
    const message = `"${quote}" - ${author}`;
    this.logger.debug(`Fetched quote: ${message}`);
    console.log("");

    this.logger.debug("Sending message...");
    await chat.sendMessage(message);
    this.logger.debug("Message sent!");
    console.log("");
  }

  private async getRandomQuoteAsync(): Promise<Quote> {
    const response = await this.ninjaQuotesApi.getAsync({
      limit: "1",
      category: "love",
    });

    return response[0];
  }
}
