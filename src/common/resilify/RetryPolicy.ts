export interface RetryPolicyContext<TError> {
  err: TError;
  attempt: number;
}

export type DelayBetweenRetriesFunction<TError> = (context: RetryPolicyContext<TError>) => number;

export type RetryIfFunction<TError> = (err: TError) => boolean | Promise<boolean>;

export type BeforeRetryFunction<TError> = (
  context: RetryPolicyContext<TError>
) => void | Promise<void>;

export interface RetryPolicyOptions<TError> {
  maxRetryAttempts?: number;
  delayBetweenRetries?: number | DelayBetweenRetriesFunction<TError>;
  retryIf?: RetryIfFunction<TError>;
  beforeRetry?: BeforeRetryFunction<TError>;
}

export class RetryPolicy<TError> {
  readonly maxRetryAttempts: number;
  readonly delayBetweenRetries: number | DelayBetweenRetriesFunction<TError>;
  readonly retryIf: RetryIfFunction<TError>;
  readonly beforeRetry: BeforeRetryFunction<TError>;

  private readonly defaultRetryIfFunction: RetryIfFunction<TError> = () => true;
  private readonly defaultMaxRetryAttempts = 1;
  private readonly defaultDelayBetweenRetries = 1000;
  private readonly defaultBeforeRetry: BeforeRetryFunction<TError> = () => {};

  constructor(options?: RetryPolicyOptions<TError>) {
    this.maxRetryAttempts = options?.maxRetryAttempts ?? this.defaultMaxRetryAttempts;
    this.delayBetweenRetries = options?.delayBetweenRetries ?? this.defaultDelayBetweenRetries;
    this.retryIf = options?.retryIf ?? this.defaultRetryIfFunction;
    this.beforeRetry = options?.beforeRetry ?? this.defaultBeforeRetry;
  }

  static default<TError>(): RetryPolicy<TError> {
    return new RetryPolicy<TError>();
  }
}
