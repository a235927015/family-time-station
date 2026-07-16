import type { Reminder } from '../domain/reminder';

export const STATE_KEY = 'laoba:state:v1';

export interface AppState {
  version: 1;
  reminders: Reminder[];
  samplesDismissed: boolean;
}

function sample(id: string, title: string, recurrence: Reminder['recurrence']): Reminder {
  const now = new Date().toISOString();
  return { id, title, recurrence, leadDays: 1, createdAt: now, updatedAt: now, completedDates: [] };
}

export function createSampleState(): AppState {
  return {
    version: 1,
    samplesDismissed: false,
    reminders: [
      sample('sample-rent', '收房租（示例）', { kind: 'monthly', day: 17 }),
      sample('sample-water', '给花浇水（示例）', { kind: 'weekly', weekday: 6 }),
      sample('sample-birthday', '家人生日（示例）', { kind: 'yearly', month: 8, day: 24 }),
    ],
  };
}

function isAppState(value: unknown): value is AppState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<AppState>;
  return state.version === 1 && Array.isArray(state.reminders) && typeof state.samplesDismissed === 'boolean';
}

export function loadState(storage: Storage): AppState {
  const raw = storage.getItem(STATE_KEY);
  if (!raw) return createSampleState();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isAppState(parsed)) throw new Error('invalid state');
    return parsed;
  } catch {
    storage.setItem(`laoba:recovery:${Date.now()}`, raw);
    return createSampleState();
  }
}

export function saveState(storage: Storage, state: AppState): void {
  storage.setItem(STATE_KEY, JSON.stringify(state));
}

export function upsertReminder(state: AppState, reminder: Reminder): AppState {
  const index = state.reminders.findIndex((entry) => entry.id === reminder.id);
  const reminders = [...state.reminders];
  if (index >= 0) reminders[index] = reminder;
  else reminders.push(reminder);
  return { ...state, reminders };
}

export function deleteReminder(state: AppState, reminderId: string): AppState {
  return { ...state, reminders: state.reminders.filter((entry) => entry.id !== reminderId) };
}

export function completeOccurrence(state: AppState, reminderId: string, date: string): AppState {
  return {
    ...state,
    reminders: state.reminders.map((entry) =>
      entry.id === reminderId && !entry.completedDates.includes(date)
        ? { ...entry, completedDates: [...entry.completedDates, date], updatedAt: new Date().toISOString() }
        : entry,
    ),
  };
}
