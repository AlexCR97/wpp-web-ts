export function scheduleTokenFactory(scheduleId: string) {
  return `node-cron__Schedule__${scheduleId}`;
}
