import { EmailSender } from "@/application";
import { RequestInterceptor } from "@/common/http";
import { env } from "@/env";
import { injectable } from "@tomasjs/core";
import { BrevoApi } from "./BrevoApi";

@injectable()
export class BrevoEmailSender implements EmailSender {
  private readonly api = new BrevoApi({
    requestInterceptor: new BrevoApiRequestInterceptor(),
  });

  async send(subject: string, htmlContent: string): Promise<void> {
    await this.api.sendEmail({
      subject,
      sender: env.brevo.email.sender,
      to: [...env.brevo.email.to],
      htmlContent,
    });
  }
}

class BrevoApiRequestInterceptor implements RequestInterceptor {
  intercept(request: RequestInit): RequestInit | Promise<RequestInit> {
    request.headers = request.headers ?? {};

    request.headers = {
      ...request.headers,
      "api-key": env.brevo.apiKey,
    };

    return request;
  }
}
