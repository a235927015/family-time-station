export type Recurrence =
  | { kind: 'once'; date: string }
  | { kind: 'weekly'; weekday: number }
  | { kind: 'monthly'; day: number }
  | { kind: 'yearly'; month: number; day: number };

export interface Reminder {
  id: string;
  title: string;
  recurrence: Recurrence;
  leadDays: 0 | 1 | 3;
  createdAt: string;
  updatedAt: string;
  completedDates: string[];
  calendarExportedAt?: string;
}

export interface Occurrence {
  reminderId: string;
  date: string;
  reminder: Reminder;
}

export type ValidationResult =
  | { ok: true; value: Reminder }
  | { ok: false; field: 'title' | 'recurrence' | 'leadDays'; message: string };

export function validateReminder(input: Reminder): ValidationResult {
  const title = input.title.trim();
  if (!title) {
    return { ok: false, field: 'title', message: '请写下要提醒的事情' };
  }
  if (title.length > 60) {
    return { ok: false, field: 'title', message: '提醒内容请控制在60个字以内' };
  }
  if (![0, 1, 3].includes(input.leadDays)) {
    return { ok: false, field: 'leadDays', message: '请选择提醒时间' };
  }

  const rule = input.recurrence;
  const invalid =
    (rule.kind === 'once' && !/^\d{4}-\d{2}-\d{2}$/.test(rule.date)) ||
    (rule.kind === 'weekly' && (!Number.isInteger(rule.weekday) || rule.weekday < 0 || rule.weekday > 6)) ||
    (rule.kind === 'monthly' && (!Number.isInteger(rule.day) || rule.day < 1 || rule.day > 31)) ||
    (rule.kind === 'yearly' &&
      (!Number.isInteger(rule.month) || rule.month < 1 || rule.month > 12 || !Number.isInteger(rule.day) || rule.day < 1 || rule.day > 31));

  if (invalid) {
    return { ok: false, field: 'recurrence', message: '请选择正确的日期' };
  }

  return { ok: true, value: { ...input, title } };
}
