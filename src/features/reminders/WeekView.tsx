import type { Occurrence, Reminder } from '../../domain/reminder';
import { fromDateKey, occurrencesBetween, toDateKey } from '../../domain/recurrence';

interface Props { reminders: Reminder[]; now: Date; onAdd: () => void; onComplete: (item: Occurrence) => void; onCalendar: (item: Occurrence) => void }

function addDays(date: Date, days: number) { const next = new Date(date); next.setDate(next.getDate() + days); return next; }
function formatDay(key: string, nowKey: string) {
  if (key === nowKey) return '今天';
  const date = fromDateKey(key); return `${date.getMonth() + 1}月${date.getDate()}日 · ${['周日','周一','周二','周三','周四','周五','周六'][date.getDay()]}`;
}
function schedule(reminders: Reminder[], now: Date) {
  const end = addDays(now, 7 - now.getDay());
  return reminders.flatMap((reminder) => {
    const created = new Date(reminder.createdAt);
    const start = created > addDays(now, -90) ? created : addDays(now, -90);
    const all = occurrencesBetween(reminder, start, end);
    const nowKey = toDateKey(now);
    const overdue = all.filter((item) => item.date < nowKey).slice(-1);
    return [...overdue, ...all.filter((item) => item.date >= nowKey)];
  }).sort((a, b) => a.date.localeCompare(b.date));
}

export function WeekView({ reminders, now, onAdd, onComplete, onCalendar }: Props) {
  const items = schedule(reminders, now); const nowKey = toDateKey(now);
  return <main className="app-shell with-nav">
    <header className="page-header"><div><p className="eyebrow">家庭时光局</p><p className="date-line">{now.getMonth()+1}月{now.getDate()}日 · {['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][now.getDay()]}</p><h1>{items.length ? `这周有 ${items.length} 件事` : '这周还没有事情'}</h1></div><button className="primary-button" onClick={onAdd}>添加提醒</button></header>
    {!items.length && <section className="empty-state"><strong>还没有要记的事</strong><p>点“添加提醒”，把每周、每月要做的事交给这里。</p></section>}
    <section className="reminder-list">{items.map((item, index) => <article className={index === 0 ? 'featured-reminder' : 'reminder-row'} key={`${item.reminderId}-${item.date}`}>
      <p className="occasion-label">{item.date < nowKey ? '已到期' : formatDay(item.date, nowKey)}</p><h2>{item.reminder.title}</h2><p className="rule-label">{describeRule(item.reminder)}</p>
      <div className="item-actions"><button className="complete-button" onClick={() => onComplete(item)}>完成了</button><button className="secondary-button" onClick={() => onCalendar(item)}>加入手机日历</button></div>
    </article>)}</section>
  </main>;
}

export function describeRule(reminder: Reminder) {
  const rule = reminder.recurrence;
  if (rule.kind === 'once') return '一次提醒';
  if (rule.kind === 'weekly') return `每${['周日','周一','周二','周三','周四','周五','周六'][rule.weekday]}`;
  if (rule.kind === 'monthly') return `每月 ${rule.day} 日`;
  return `每年 ${rule.month} 月 ${rule.day} 日`;
}
