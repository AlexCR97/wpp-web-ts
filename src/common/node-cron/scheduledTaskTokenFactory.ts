export function scheduledTaskTokenFactory(scheduleId: string) {
  return `node-cron__ScheduledTask__${scheduleId}`;
}
