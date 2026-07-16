import { describe, expect, it } from 'vitest';
import type { Reminder } from '../domain/reminder';
import {
  completeOccurrence,
  deleteReminder,
  loadState,
  saveState,
  upsertReminder,
} from './reminderStore';

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

function item(id = 'r-1'): Reminder {
  return {
    id,
    title: '收房租',
    recurrence: { kind: 'monthly', day: 17 },
    leadDays: 1,
    createdAt: '2026-07-16T00:00:00.000Z',
    updatedAt: '2026-07-16T00:00:00.000Z',
    completedDates: [],
  };
}

describe('reminderStore', () => {
  it('returns three labelled samples for empty storage', () => {
    const state = loadState(new MemoryStorage());
    expect(state.reminders).toHaveLength(3);
    expect(state.reminders.every((entry) => entry.title.includes('示例'))).toBe(true);
  });

  it('round-trips a saved state', () => {
    const storage = new MemoryStorage();
    const state = { version: 1 as const, reminders: [item()], samplesDismissed: true };
    saveState(storage, state);
    expect(loadState(storage)).toEqual(state);
  });

  it('upserts, completes one occurrence, and deletes by id', () => {
    let state = { version: 1 as const, reminders: [item()], samplesDismissed: true };
    state = upsertReminder(state, { ...item(), title: '收 3 号房房租' });
    expect(state.reminders[0].title).toBe('收 3 号房房租');
    state = completeOccurrence(state, 'r-1', '2026-07-17');
    expect(state.reminders[0].completedDates).toEqual(['2026-07-17']);
    state = deleteReminder(state, 'r-1');
    expect(state.reminders).toEqual([]);
  });

  it('keeps malformed raw data in a recovery key', () => {
    const storage = new MemoryStorage();
    storage.setItem('laoba:state:v1', '{broken');
    const state = loadState(storage);
    expect(state.reminders).toHaveLength(3);
    expect([...Array(storage.length)].map((_, index) => storage.key(index)).some((key) => key?.startsWith('laoba:recovery:'))).toBe(true);
  });
});
