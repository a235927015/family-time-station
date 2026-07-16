import { describe, expect, it } from 'vitest';
import { validateReminder } from './reminder';

const base = {
  id: 'r-1',
  title: '收房租',
  recurrence: { kind: 'monthly' as const, day: 17 },
  leadDays: 1 as const,
  createdAt: '2026-07-16T00:00:00.000Z',
  updatedAt: '2026-07-16T00:00:00.000Z',
  completedDates: [],
};

describe('validateReminder', () => {
  it('trims a valid title', () => {
    const result = validateReminder({ ...base, title: '  收房租  ' });
    expect(result).toMatchObject({ ok: true, value: { title: '收房租' } });
  });

  it('rejects a blank title with a useful message', () => {
    expect(validateReminder({ ...base, title: ' ' })).toEqual({
      ok: false,
      field: 'title',
      message: '请写下要提醒的事情',
    });
  });

  it('rejects an invalid monthly day', () => {
    expect(validateReminder({ ...base, recurrence: { kind: 'monthly', day: 32 } })).toMatchObject({
      ok: false,
      field: 'recurrence',
    });
  });
});
