import type { Reminder } from '../../domain/reminder';
import { describeRule } from './WeekView';

interface Props { reminders: Reminder[]; onEdit: (item: Reminder) => void; onDelete: (item: Reminder) => void }
export function AllView({ reminders, onEdit, onDelete }: Props) {
  return <main className="app-shell with-nav"><header className="simple-header"><p className="eyebrow">家庭时光局</p><h1>全部事项</h1><p>{reminders.length} 件正在记着的事</p></header>
    {!reminders.length ? <section className="empty-state"><strong>还没有要记的事</strong></section> : <section className="all-list">{reminders.map((item) => <article className="all-row" key={item.id}><div><h2>{item.title}</h2><p>{describeRule(item)} · {item.leadDays ? `提前 ${item.leadDays} 天显示` : '当天显示'}</p></div><div><button className="small-button" onClick={() => onEdit(item)}>修改</button><button className="small-button danger" onClick={() => onDelete(item)}>删除</button></div></article>)}</section>}
  </main>;
}
