import { describe, expect, it } from 'vitest';
import type { Reminder } from '../domain/reminder';
import { buildIcs } from './ics';

function reminder(recurrence: Reminder['recurrence'], title = '收房租, 3号房;记得'): Reminder {
  return { id: 'rent', title, recurrence, leadDays: 1, createdAt: '', updatedAt: '', completedDates: [] };
}

describe('buildIcs', () => {
  it('creates an all-day once-only event with escaped summary and CRLF', () => {
    const result = buildIcs(reminder({ kind: 'once', date: '2026-07-17' }), '2026-07-17');
    expect(result).toContain('DTSTART;VALUE=DATE:20260717\r\n');
    expect(result).toContain('SUMMARY:收房租\\, 3号房\\;记得\r\n');
    expect(result).toContain('UID:rent@family-time-station\r\n');
    expect(result).not.toContain('RRULE');
  });

  it.each([
    [{ kind: 'weekly', weekday: 1 } as const, 'RRULE:FREQ=WEEKLY;BYDAY=MO'],
    [{ kind: 'monthly', day: 17 } as const, 'RRULE:FREQ=MONTHLY;BYMONTHDAY=17'],
    [{ kind: 'yearly', month: 8, day: 24 } as const, 'RRULE:FREQ=YEARLY;BYMONTH=8;BYMONTHDAY=24'],
  ])('creates recurrence rule for %o', (recurrence, expected) => {
    expect(buildIcs(reminder(recurrence), '2026-07-17')).toContain(expected);
  });
});
