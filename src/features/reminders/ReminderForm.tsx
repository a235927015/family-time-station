import { useState, type FormEvent } from 'react';
import { validateReminder, type Reminder, type Recurrence } from '../../domain/reminder';
import { toDateKey } from '../../domain/recurrence';

interface Props { initial?: Reminder; onSave: (reminder: Reminder) => void; onCancel: () => void }
type Kind = Recurrence['kind'];

export function ReminderForm({ initial, onSave, onCancel }: Props) {
  const initialKind = initial?.recurrence.kind ?? 'once';
  const [title, setTitle] = useState(initial?.title ?? '');
  const [kind, setKind] = useState<Kind>(initialKind);
  const [date, setDate] = useState(initial?.recurrence.kind === 'once' ? initial.recurrence.date : toDateKey(new Date()));
  const [weekday, setWeekday] = useState(initial?.recurrence.kind === 'weekly' ? initial.recurrence.weekday : new Date().getDay());
  const [day, setDay] = useState(initial?.recurrence.kind === 'monthly' ? initial.recurrence.day : new Date().getDate());
  const [month, setMonth] = useState(initial?.recurrence.kind === 'yearly' ? initial.recurrence.month : new Date().getMonth() + 1);
  const [yearDay, setYearDay] = useState(initial?.recurrence.kind === 'yearly' ? initial.recurrence.day : new Date().getDate());
  const [leadDays, setLeadDays] = useState<0 | 1 | 3>(initial?.leadDays ?? 0);
  const [error, setError] = useState('');

  function recurrence(): Recurrence {
    if (kind === 'once') return { kind, date };
    if (kind === 'weekly') return { kind, weekday };
    if (kind === 'monthly') return { kind, day };
    return { kind, month, day: yearDay };
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    const now = new Date().toISOString();
    const candidate: Reminder = {
      id: initial?.id ?? globalThis.crypto?.randomUUID?.() ?? `reminder-${Date.now()}`,
      title,
      recurrence: recurrence(),
      leadDays,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
      completedDates: initial?.completedDates ?? [],
      calendarExportedAt: initial?.calendarExportedAt,
    };
    const result = validateReminder(candidate);
    if (!result.ok) { setError(result.message); return; }
    onSave(result.value);
  }

  return (
    <main className="app-shell form-page">
      <header className="simple-header"><div><p className="eyebrow">家庭时光局</p><h1>{initial ? '修改提醒' : '添加一件事'}</h1></div></header>
      <form onSubmit={submit}>
        <label className="field"><span>要提醒什么？</span><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：收房租" autoFocus /></label>
        <fieldset><legend>多久一次？</legend><div className="choice-grid four">
          {([['once', '一次'], ['weekly', '每周'], ['monthly', '每月'], ['yearly', '每年']] as const).map(([value, label]) =>
            <button className={kind === value ? 'choice active' : 'choice'} type="button" key={value} onClick={() => setKind(value)}>{label}</button>)}
        </div></fieldset>
        {kind === 'once' && <label className="field"><span>哪一天？</span><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>}
        {kind === 'weekly' && <label className="field"><span>星期几？</span><select value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>{['星期日','星期一','星期二','星期三','星期四','星期五','星期六'].map((label, index) => <option value={index} key={label}>{label}</option>)}</select></label>}
        {kind === 'monthly' && <label className="field"><span>每月几号？</span><input type="number" min="1" max="31" value={day} onChange={(e) => setDay(Number(e.target.value))} /></label>}
        {kind === 'yearly' && <div className="field-pair"><label className="field"><span>几月？</span><input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(Number(e.target.value))} /></label><label className="field"><span>几号？</span><input type="number" min="1" max="31" value={yearDay} onChange={(e) => setYearDay(Number(e.target.value))} /></label></div>}
        <fieldset><legend>提前多久显示？</legend><div className="choice-grid three">{([[0,'当天'],[1,'提前1天'],[3,'提前3天']] as const).map(([value,label]) => <button type="button" key={value} className={leadDays === value ? 'choice active' : 'choice'} onClick={() => setLeadDays(value)}>{label}</button>)}</div></fieldset>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button className="primary-button wide" type="submit">保存提醒</button><button className="text-button" type="button" onClick={onCancel}>取消</button></div>
      </form>
    </main>
  );
}
