import {
  ClassConstructor,
  ContainerSetupFactory,
  ContainerSetupFunction,
  Logger,
  TomasLogger,
} from "@tomasjs/core";
import cron from "node-cron";
import { Schedule } from "./Schedule";
import { getErrorMessage } from "../errors";
import { TokenBuilder } from "@tomasjs/core/tokens";

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
  private readonly logger = new TomasLogger(UseSchedule.name, "debug");

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
            const errorMessage = getErrorMessage(err);
            this.logger.error(errorMessage);
            console.log("err", err);
          }
        },
        this.options
      );

      container.addInstance(task, scheduledTaskTokenFactory(this.scheduleId));
    };
  }
}

function scheduleTokenFactory(scheduleId: string): string {
  return new TokenBuilder().with("node-cron").with("Schedule").with(scheduleId).build();
}

function scheduledTaskTokenFactory(scheduleId: string): string {
  return new TokenBuilder().with("node-cron").with("ScheduledTask").with(scheduleId).build();
}
