import { describe, expect, it } from 'vitest';
import type { Reminder } from './reminder';
import { nextOccurrence, occurrencesBetween } from './recurrence';

function reminder(recurrence: Reminder['recurrence'], completedDates: string[] = []): Reminder {
  return {
    id: 'r-1',
    title: '测试事项',
    recurrence,
    leadDays: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    completedDates,
  };
}

describe('nextOccurrence', () => {
  it('clamps monthly day 31 to the last day of a short month', () => {
    expect(nextOccurrence(reminder({ kind: 'monthly', day: 31 }), new Date(2026, 1, 1))?.date).toBe('2026-02-28');
  });

  it('clamps a yearly leap day to February 28 in a non-leap year', () => {
    expect(nextOccurrence(reminder({ kind: 'yearly', month: 2, day: 29 }), new Date(2027, 0, 1))?.date).toBe('2027-02-28');
  });

  it('moves a weekly reminder seven days after completing this Monday', () => {
    const item = reminder({ kind: 'weekly', weekday: 1 }, ['2026-07-13']);
    expect(nextOccurrence(item, new Date(2026, 6, 13))?.date).toBe('2026-07-20');
  });
});

describe('occurrencesBetween', () => {
  it('returns every monthly occurrence in the inclusive range', () => {
    const results = occurrencesBetween(
      reminder({ kind: 'monthly', day: 31 }),
      new Date(2026, 0, 1),
      new Date(2026, 2, 31),
    );
    expect(results.map((item) => item.date)).toEqual(['2026-01-31', '2026-02-28', '2026-03-31']);
  });

  it('excludes only a completed occurrence', () => {
    const results = occurrencesBetween(
      reminder({ kind: 'weekly', weekday: 4 }, ['2026-07-16']),
      new Date(2026, 6, 9),
      new Date(2026, 6, 23),
    );
    expect(results.map((item) => item.date)).toEqual(['2026-07-09', '2026-07-23']);
  });
});
