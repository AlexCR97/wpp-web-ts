import { TomasLogger, inject } from "@tomasjs/core";
import { EventHandler, eventHandler } from "@tomasjs/cqrs";
import { EmailSender, emailSenderToken } from "./EmailSender";
import { ResilienceStrategy } from "@/common/resilify";
import { getErrorMessage } from "@/common/errors";

export class ErrorOccurredEvent {
  constructor(readonly error: unknown, readonly occurredAt: Date) {}
}

@eventHandler(ErrorOccurredEvent)
export class ErrorOccurredEventHandler implements EventHandler<ErrorOccurredEvent> {
  private readonly logger = new TomasLogger(ErrorOccurredEventHandler.name, "debug");

  constructor(@inject(emailSenderToken) private readonly emailSender: EmailSender) {}

  async handle({ error, occurredAt }: ErrorOccurredEvent): Promise<void> {
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
        .execute(() => this.sendEmail(error, occurredAt));

      this.logger.info("Email sent!");
    } catch (err) {
      this.logger.error(`Could not send email. ${getErrorMessage(err)}`);
      console.log("err", err);
    }
  }

  private async sendEmail(err: unknown, occurredAt: Date) {
    const errString = this.getErrorString(err);

    await this.emailSender.send(
      "An error occurred!",
      /*html*/ `
      <html>
        <body>
          <p>Hello, Pablo Castillo!</p>
          <p>An error occurred at ${occurredAt.toString()}:</p>
          <p>${getErrorMessage(err)}</p>
          <p>${errString}</p>
        </body>
      </html>
    `
    );
  }

  private getErrorString(err: unknown): string {
    try {
      return JSON.stringify(err) ?? `${err}`;
    } catch {
      return `${err}`;
    }
  }
}
