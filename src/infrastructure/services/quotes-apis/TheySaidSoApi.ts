import { HttpClient, QueryParams, RequestInterceptor } from "@/common/http";
import { env } from "@/env";
import { TomasLogger, injectable } from "@tomasjs/core";

interface TheySaidSoApiResponse {
  success: {
    total: number;
  };
  contents: {
    quotes: {
      quote: string;
      length: number;
      author: string;
      tags: string;
      category: string;
      language: string;
      date: string;
      permalink: string;
      id: string;
      background: string;
      title: string;
    }[];
  };
  baseUrl: string;
  copyright: {
    year: number;
    url: string;
  };
}

class TheySaidSoApiRequestInterceptor implements RequestInterceptor {
  intercept(request: RequestInit): RequestInit | Promise<RequestInit> {
    request.headers = request.headers ?? {};

    request.headers = {
      ...request.headers,
      "X-TheySaidSo-Api-Secret": env.api.theySaidSo.apiKey,
    };

    return request;
  }
}

@injectable()
export class TheySaidSoApi {
  private readonly httpClient = new HttpClient({
    baseUrl: env.api.theySaidSo.url,
    requestInterceptor: new TheySaidSoApiRequestInterceptor(),
  });

  private readonly logger = new TomasLogger(TheySaidSoApi.name, "debug");

  async getQuoteOfTheDayAsync(options?: { category?: string }): Promise<TheySaidSoApiResponse> {
    const query: QueryParams = {};

    if (options) {
      if (options.category !== undefined) {
        query["category"] = options.category.toString();
      }
    }

    this.logger.debug(`query: ${JSON.stringify(query)}`);

    return await this.httpClient.getAsync<TheySaidSoApiResponse>("qod.json", {
      query,
    });
  }
}
