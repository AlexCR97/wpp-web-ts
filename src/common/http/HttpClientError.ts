export class HttpClientError extends Error {
  constructor(
    readonly method: string,
    readonly url: string,
    readonly status: number,
    readonly statusText: string,
    readonly response: unknown
  ) {
    super(`${method} to ${url} failed with status code ${status} (${statusText})`);
  }
}
