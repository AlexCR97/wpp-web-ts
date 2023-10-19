import { RetryPolicy, RetryPolicyOptions } from "./RetryPolicy";

export type AsyncFunction<TResult> = () => Promise<TResult>;

export interface IResilienceStrategy<TResult> {
  useRetry<TError>(policy: RetryPolicyOptions<TError>): IResilienceStrategy<TResult>;
  execute(func: AsyncFunction<TResult>): Promise<TResult>;
}

export class ResilienceStrategy<TResult> implements IResilienceStrategy<TResult> {
  private retryPolicy = RetryPolicy.default<any>();

  useRetry<TError>(options: RetryPolicyOptions<TError>): IResilienceStrategy<TResult> {
    this.retryPolicy = new RetryPolicy<TError>(options);
    return this;
  }

  async execute(func: AsyncFunction<TResult>): Promise<TResult> {
    let currentRetryAttempt = 0;

    while (true) {
      try {
        return await func();
      } catch (err) {
        if (currentRetryAttempt > this.retryPolicy.maxRetryAttempts) {
          throw err;
        }

        const shouldRetry = await this.retryPolicy.retryIf(err);

        if (!shouldRetry) {
          throw err;
        }

        await this.waitForRetryDelay(err, currentRetryAttempt);
        await this.retryPolicy.beforeRetry({ err, attempt: currentRetryAttempt });
      } finally {
        currentRetryAttempt += 1;
      }
    }
  }

  private async waitForRetryDelay(err: unknown, attempt: number): Promise<void> {
    const milliseconds =
      typeof this.retryPolicy.delayBetweenRetries === "number"
        ? this.retryPolicy.delayBetweenRetries
        : this.retryPolicy.delayBetweenRetries({ err, attempt });

    await this.wait(milliseconds);
  }

  private wait(milliseconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), milliseconds);
    });
  }
}
