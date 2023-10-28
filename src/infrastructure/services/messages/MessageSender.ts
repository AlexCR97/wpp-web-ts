import { QuoteSentEvent } from "@/application/QuoteSentEvent";
import { IMessageSender } from "@/application/services/messages";
import { getErrorMessage } from "@/common/errors";
import { env } from "@/env";
import { QuotesApi } from "@/infrastructure/services/quotes-apis";
import { TomasLogger, inject, injectable } from "@tomasjs/core";
import { EventDispatcher } from "@tomasjs/cqrs";
import { Client } from "whatsapp-web.js";

@injectable()
export class MessageSender implements IMessageSender {
  private readonly logger = new TomasLogger(MessageSender.name, "debug");

  constructor(
    @inject(Client) private readonly client: Client,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
    @inject(QuotesApi) private readonly quotesApi: QuotesApi
  ) {}

  private get chatId(): string {
    return env.wpp.chatId;
  }

  async sendAsync(): Promise<void> {
    try {
      this.logger.debug(`Loading chat with id "${this.chatId}" ...`);

      const chat = await this.client.getChatById(this.chatId);
      this.logger.debug(`Found chat: ${chat.name}`);

      this.logger.debug("Fetching random quote from external api...");
      const quote = await this.quotesApi.getRandomQuoteAsync();
      const message = `"${quote.quote}" - ${quote.author}`;
      this.logger.debug(`Fetched quote: ${message}`);

      this.logger.debug("Sending message...");
      await chat.sendMessage(message);
      this.logger.debug("Message sent!");

      this.eventDispatcher.emit(new QuoteSentEvent(quote, new Date()));
    } catch (err) {
      this.logger.error(getErrorMessage(err));
      console.log("err", err);
    }
  }
}
