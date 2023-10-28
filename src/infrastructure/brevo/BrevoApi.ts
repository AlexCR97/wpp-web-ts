import { HttpClient, RequestInterceptor } from "@/common/http";

interface SendEmailRequest {
  subject: string;
  htmlContent: string;
  sender: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
}

export class BrevoApi {
  private readonly httpClient;

  constructor(options: { requestInterceptor: RequestInterceptor }) {
    this.httpClient = new HttpClient({
      baseUrl: "https://api.brevo.com",
      requestInterceptor: options.requestInterceptor,
    });
  }

  async sendEmail(request: SendEmailRequest) {
    await this.httpClient.postAsync("/v3/smtp/email", request);
  }
}
