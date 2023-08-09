export interface Schedule {
  run(now: Date | "manual" | "init"): Promise<void>;
}
