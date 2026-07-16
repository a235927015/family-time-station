import { describe, expect, it } from 'vitest';
import type { AppState } from './reminderStore';
import { exportBackup, parseBackup } from './backup';

const state: AppState = {
  version: 1,
  samplesDismissed: true,
  reminders: [{
    id: 'rent', title: '收房租', recurrence: { kind: 'monthly', day: 17 }, leadDays: 1,
    createdAt: '2026-07-16T00:00:00.000Z', updatedAt: '2026-07-16T00:00:00.000Z', completedDates: [],
  }],
};

describe('backup', () => {
  it('round-trips valid state', () => {
    expect(parseBackup(exportBackup(state))).toEqual({ ok: true, state });
  });

  it('rejects malformed JSON', () => {
    expect(parseBackup('{broken')).toEqual({ ok: false, message: '备份文件无法读取' });
  });

  it('rejects unsupported versions', () => {
    expect(parseBackup(JSON.stringify({ ...state, version: 2 }))).toEqual({ ok: false, message: '这个备份版本暂不支持' });
  });

  it('rejects invalid reminder rules', () => {
    const invalid = { ...state, reminders: [{ ...state.reminders[0], recurrence: { kind: 'monthly', day: 40 } }] };
    expect(parseBackup(JSON.stringify(invalid))).toEqual({ ok: false, message: '备份内容不完整或已损坏' });
  });
});
