import { TomasLogger, inject } from "@tomasjs/core";
import { EventHandler, eventHandler } from "@tomasjs/cqrs";
import { Quote } from "./Quote";
import { EmailSender, emailSenderToken } from "./EmailSender";
import { ResilienceStrategy } from "@/common/resilify";
import { getErrorMessage } from "@/common/errors";

export class QuoteSentEvent {
  constructor(readonly quote: Quote, readonly sentAt: Date) {}
}

@eventHandler(QuoteSentEvent)
export class QuoteSentEventHandler implements EventHandler<QuoteSentEvent> {
  private readonly logger = new TomasLogger(QuoteSentEventHandler.name, "debug");

  constructor(@inject(emailSenderToken) private readonly emailSender: EmailSender) {}

  async handle({ quote, sentAt }: QuoteSentEvent): Promise<void> {
    try {
      this.logger.info("Sending email...");

      await new ResilienceStrategy()
        .useRetry({
          maxRetryAttempts: 3,
          delayBetweenRetries: ({ attempt }) => (attempt + 1) * 1000,
          beforeRetry: ({ attempt, err }) => {
            const errorMessage = getErrorMessage(err);
            this.logger.error(`Failed to send email on retry attempt #${attempt}: ${errorMessage}`);
          },
        })
        .execute(() => this.sendEmail(sentAt, quote));

      this.logger.info("Email sent!");
    } catch (err) {
      this.logger.error(`Could not send email. Error: ${getErrorMessage(err)}`);
      console.log("err", err);
    }
  }

  private async sendEmail(sentAt: Date, quote: Quote) {
    await this.emailSender.send(/*html*/ `
      <html>
        <body>
          <p>Hello, Pablo Castillo!</p>
          <p>The following quote was sent at ${sentAt.toString()}:</p>
          <p>
            ${quote.quote}<br>
            ${quote.author}
          </p>
        </body>
      </html>
    `);
  }
}
