import type { Occurrence, Reminder } from './reminder';

export function atNoon(year: number, monthIndex: number, day: number): Date {
  return new Date(year, monthIndex, day, 12, 0, 0, 0);
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return atNoon(year, month - 1, day);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function clampedDate(year: number, month: number, day: number): Date {
  return atNoon(year, month - 1, Math.min(day, daysInMonth(year, month)));
}

function dateOnly(date: Date): Date {
  return atNoon(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  const result = dateOnly(date);
  result.setDate(result.getDate() + days);
  return dateOnly(result);
}

function firstCandidate(reminder: Reminder, from: Date): Date | null {
  const start = dateOnly(from);
  const rule = reminder.recurrence;

  if (rule.kind === 'once') {
    const candidate = fromDateKey(rule.date);
    return candidate >= start ? candidate : null;
  }

  if (rule.kind === 'weekly') {
    const offset = (rule.weekday - start.getDay() + 7) % 7;
    return addDays(start, offset);
  }

  if (rule.kind === 'monthly') {
    let candidate = clampedDate(start.getFullYear(), start.getMonth() + 1, rule.day);
    if (candidate < start) {
      const nextMonth = start.getMonth() + 1;
      const year = start.getFullYear() + Math.floor(nextMonth / 12);
      candidate = clampedDate(year, (nextMonth % 12) + 1, rule.day);
    }
    return candidate;
  }

  let candidate = clampedDate(start.getFullYear(), rule.month, rule.day);
  if (candidate < start) {
    candidate = clampedDate(start.getFullYear() + 1, rule.month, rule.day);
  }
  return candidate;
}

export function nextOccurrence(reminder: Reminder, from: Date): Occurrence | null {
  let cursor = dateOnly(from);
  for (let attempts = 0; attempts < 400; attempts += 1) {
    const candidate = firstCandidate(reminder, cursor);
    if (!candidate) return null;
    const key = toDateKey(candidate);
    if (!reminder.completedDates.includes(key)) {
      return { reminderId: reminder.id, date: key, reminder };
    }
    cursor = addDays(candidate, 1);
  }
  return null;
}

export function occurrencesBetween(reminder: Reminder, start: Date, end: Date): Occurrence[] {
  const results: Occurrence[] = [];
  let cursor = dateOnly(start);
  const boundary = dateOnly(end);

  for (let attempts = 0; attempts < 400; attempts += 1) {
    const occurrence = nextOccurrence(reminder, cursor);
    if (!occurrence) break;
    const date = fromDateKey(occurrence.date);
    if (date > boundary) break;
    results.push(occurrence);
    cursor = addDays(date, 1);
  }

  return results;
}
