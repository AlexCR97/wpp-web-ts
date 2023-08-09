import { HttpClient, QueryParams, RequestInterceptor } from "@/common/http";
import { env } from "@/env";
import { injectable } from "@tomasjs/core";
import { TomasLogger } from "@tomasjs/logging";

interface PaperQuotesApiResponse {
  next: string;
  previous?: string;
  results: {
    quote: string;
    author: string;
    likes: number;
    tags: string[];
    pk: number;
    image?: string;
    language: string;
  }[];
}

class PaperQuotesApiRequestInterceptor implements RequestInterceptor {
  intercept(request: RequestInit): RequestInit | Promise<RequestInit> {
    request.headers = request.headers ?? {};

    request.headers = {
      ...request.headers,
      Authorization: `Token ${env.api.paperQuotes.apiKey}`,
    };

    return request;
  }
}

@injectable()
export class PaperQuotesApi {
  private readonly httpClient = new HttpClient({
    baseUrl: env.api.paperQuotes.url,
    requestInterceptor: new PaperQuotesApiRequestInterceptor(),
  });

  private readonly logger = new TomasLogger(PaperQuotesApi.name, "debug");

  async getAsync(options?: {
    limit?: number;
    offset?: number;
    order?: string;
    language?: string;
    random?: string;
    tags?: string[];
  }): Promise<PaperQuotesApiResponse> {
    const query: QueryParams = {};

    if (options) {
      if (options.limit !== undefined) {
        query["limit"] = options.limit.toString();
      }

      if (options.offset !== undefined) {
        query["offset"] = options.offset.toString();
      }

      if (options.order) {
        query["order"] = options.order.toString();
      }

      if (options.language) {
        query["language"] = options.language;
      }

      if (options.tags) {
        query["tags"] = options.tags.join(",");
      }

      if (options.random) {
        query["random"] = options.random;
      }
    }

    this.logger.debug(`query: ${JSON.stringify(query)}`);

    return await this.httpClient.getAsync<PaperQuotesApiResponse>("/", {
      query,
    });
  }
}
