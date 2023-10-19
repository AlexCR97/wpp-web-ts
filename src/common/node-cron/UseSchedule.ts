import {
  ClassConstructor,
  ContainerSetupFactory,
  ContainerSetupFunction,
  Logger,
} from "@tomasjs/core";
import cron from "node-cron";
import { scheduleTokenFactory } from "./scheduleTokenFactory";
import { Schedule } from "./Schedule";
import { scheduledTaskTokenFactory } from "./scheduledTaskTokenFactory";

interface UseScheduleOptions {
  cronExpression: string;

  schedule: ClassConstructor<Schedule>;

  logger?: Logger;

  /**
   * A boolean to set if the created task is scheduled.
   *
   * Defaults to `true`
   */
  scheduled?: boolean | undefined;

  /**
   * The timezone that is used for job scheduling
   */
  timezone?: string;

  /**
   * Specifies whether to recover missed executions instead of skipping them.
   *
   * Defaults to `false`
   */
  recoverMissedExecutions?: boolean;

  /**
   * The schedule name
   */
  name?: string;

  /**
   * Execute task immediately after creation
   */
  runOnInit?: boolean;
}

export class UseSchedule implements ContainerSetupFactory {
  constructor(private readonly options: UseScheduleOptions) {}

  private get scheduleId(): string {
    return this.options.name ?? this.options.schedule.name;
  }

  create(): ContainerSetupFunction {
    return (container) => {
      const scheduleToken = scheduleTokenFactory(this.scheduleId);

      container.addClass(this.options.schedule, { token: scheduleToken });

      const task = cron.schedule(
        this.options.cronExpression,
        async (now) => {
          try {
            const schedule = container.get<Schedule>(scheduleToken);
            await schedule.run(now);
          } catch (err) {
            // TODO Log error
            // console.log("err", err);
          }
        },
        this.options
      );

      container.addInstance(task, scheduledTaskTokenFactory(this.scheduleId));
    };
  }
}
