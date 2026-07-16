import { validateReminder, type Reminder } from '../domain/reminder';
import type { AppState } from './reminderStore';

export type ParseResult = { ok: true; state: AppState } | { ok: false; message: string };

export function exportBackup(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

function isReminder(value: unknown): value is Reminder {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<Reminder>;
  if (
    typeof item.id !== 'string' || typeof item.title !== 'string' ||
    typeof item.createdAt !== 'string' || typeof item.updatedAt !== 'string' ||
    !Array.isArray(item.completedDates) || !item.completedDates.every((date) => typeof date === 'string') ||
    !item.recurrence || typeof item.recurrence !== 'object' || ![0, 1, 3].includes(item.leadDays as number)
  ) return false;
  return validateReminder(item as Reminder).ok;
}

export function parseBackup(text: string): ParseResult {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, message: '备份文件无法读取' };
  }
  if (!value || typeof value !== 'object') return { ok: false, message: '备份内容不完整或已损坏' };
  const state = value as Partial<AppState>;
  if (state.version !== 1) return { ok: false, message: '这个备份版本暂不支持' };
  if (!Array.isArray(state.reminders) || typeof state.samplesDismissed !== 'boolean' || !state.reminders.every(isReminder)) {
    return { ok: false, message: '备份内容不完整或已损坏' };
  }
  return { ok: true, state: state as AppState };
}

export function downloadTextFile(name: string, content: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
