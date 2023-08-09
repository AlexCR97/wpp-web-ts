import { HttpClient, RequestInterceptor } from "@/common/http";
import { env } from "@/env";
import { injectable } from "@tomasjs/core";

interface NinjaQuotesApiResponse {
  quote: string;
  author: string;
  category: string;
}

class NinjaQuotesApiRequestInterceptor implements RequestInterceptor {
  intercept(request: RequestInit): RequestInit | Promise<RequestInit> {
    request.headers = request.headers ?? {};

    request.headers = {
      ...request.headers,
      "X-Api-Key": env.api.ninjaQuotes.apiKey,
    };

    return request;
  }
}

@injectable()
export class NinjaQuotesApi {
  private readonly httpClient = new HttpClient({
    baseUrl: env.api.ninjaQuotes.url,
    requestInterceptor: new NinjaQuotesApiRequestInterceptor(),
  });

  async getAsync(options?: {
    limit?: string;
    category?: string;
  }): Promise<NinjaQuotesApiResponse[]> {
    return await this.httpClient.getAsync<NinjaQuotesApiResponse[]>("/", {
      query: {
        ...options,
      },
    });
  }
}
