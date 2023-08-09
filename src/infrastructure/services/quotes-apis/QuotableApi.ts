import { HttpClient, QueryParams } from "@/common/http";
import { env } from "@/env";
import { injectable } from "@tomasjs/core";
import { TomasLogger } from "@tomasjs/logging";

interface QuotableApiResponse {
  _id: string;
  content: string;
  author: string;
  authorSlug: string;
  length: number;
  tags: string[];
}

@injectable()
export class QuotableApi {
  private readonly httpClient = new HttpClient({
    baseUrl: env.api.quotable.url,
  });

  private readonly logger = new TomasLogger(QuotableApi.name, "debug");

  async getRandomQuotesAsync(options?: {
    limit?: number;
    maxLength?: number;
    minLength?: number;
    tags?: string;
    author?: string;
    authorId?: string;
  }): Promise<QuotableApiResponse[]> {
    const query: QueryParams = {};

    if (options) {
      if (options.limit !== undefined) {
        query["limit"] = options.limit.toString();
      }

      if (options.maxLength !== undefined) {
        query["maxLength"] = options.maxLength.toString();
      }

      if (options.minLength !== undefined) {
        query["minLength"] = options.minLength.toString();
      }

      if (options.tags !== undefined) {
        query["tags"] = options.tags.toString();
      }

      if (options.author !== undefined) {
        query["author"] = options.author.toString();
      }

      if (options.authorId !== undefined) {
        query["authorId"] = options.authorId.toString();
      }
    }

    this.logger.debug(`query: ${JSON.stringify(query)}`);

    return await this.httpClient.getAsync<QuotableApiResponse[]>("quotes/random", {
      query,
    });
  }
}
