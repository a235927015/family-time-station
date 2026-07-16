import type { Reminder } from '../domain/reminder';
import { downloadTextFile } from './backup';

const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

function escapeText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function compactDate(date: string): string {
  return date.replaceAll('-', '');
}

function recurrenceRule(reminder: Reminder): string | null {
  const rule = reminder.recurrence;
  if (rule.kind === 'once') return null;
  if (rule.kind === 'weekly') return `FREQ=WEEKLY;BYDAY=${WEEKDAYS[rule.weekday]}`;
  if (rule.kind === 'monthly') return `FREQ=MONTHLY;BYMONTHDAY=${rule.day}`;
  return `FREQ=YEARLY;BYMONTH=${rule.month};BYMONTHDAY=${rule.day}`;
}

export function buildIcs(reminder: Reminder, occurrenceDate: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Laoba Time Station//ZH-CN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${reminder.id}@family-time-station`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    `DTSTART;VALUE=DATE:${compactDate(occurrenceDate)}`,
    `SUMMARY:${escapeText(reminder.title)}`,
  ];
  const rrule = recurrenceRule(reminder);
  if (rrule) lines.push(`RRULE:${rrule}`);
  lines.push('END:VEVENT', 'END:VCALENDAR', '');
  return lines.join('\r\n');
}

export function downloadReminderIcs(reminder: Reminder, occurrenceDate: string): void {
  downloadTextFile(`${reminder.title}.ics`, buildIcs(reminder, occurrenceDate), 'text/calendar;charset=utf-8');
}
