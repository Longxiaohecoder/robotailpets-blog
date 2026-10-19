// IANA-zone conversion: publish only at daytime slots, away from DST ambiguity.
export function localParts(now, timezone) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  }).formatToParts(now).map(p => [p.type, p.value]));
}
export function localDate(now, timezone) {
  const p = localParts(now, timezone);
  return `${p.year}-${p.month}-${p.day}`;
}
export function publicationTime(day, plan) {
  const weekday = new Date(day + 'T12:00:00Z').toLocaleDateString('en-US', {weekday:'short', timeZone:'UTC'});
  if (!plan.weekdays.includes(weekday)) return null;
  const time = plan.times?.[weekday] ?? `${String(plan.hour).padStart(2, '0')}:00:00`;
  if (!/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(time)) throw new Error('Invalid publication time for ' + weekday);
  const wall = Date.parse(`${day}T${time}Z`);
  let instant = wall;
  for (let i = 0; i < 3; i++) {
    const p = localParts(new Date(instant), plan.timezone);
    const represented = Date.parse(`${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}Z`);
    instant += wall - represented;
  }
  const result = new Date(instant);
  const p = localParts(result, plan.timezone);
  if (localDate(result, plan.timezone) !== day || `${p.hour}:${p.minute}:${p.second}` !== time) throw new Error('Nonexistent publication time');
  return result;
}
export function publicationDates(history, timezone) {
  return history.publications.map(p => p.publishedAt ? localDate(new Date(p.publishedAt), timezone) : p.date);
}
