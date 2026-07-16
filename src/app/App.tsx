import { useState } from 'react';
import type { Occurrence, Reminder } from '../domain/reminder';
import { AllView } from '../features/reminders/AllView';
import { BirthdayBook } from '../features/birthday/BirthdayBook';
import { birthdayConfig } from '../features/birthday/trips';
import { ReminderForm } from '../features/reminders/ReminderForm';
import { Settings } from '../features/reminders/Settings';
import { WeekView } from '../features/reminders/WeekView';
import '../features/reminders/reminders.css';
import { downloadReminderIcs } from '../services/ics';
import { completeOccurrence, deleteReminder, loadState, saveState, upsertReminder, type AppState } from '../services/reminderStore';

type View = 'week' | 'all' | 'settings';

export function App() {
  const [state, setState] = useState<AppState>(() => loadState(window.localStorage));
  const [view, setView] = useState<View>('week');
  const [editing, setEditing] = useState<Reminder | 'new' | null>(null);
  const [showBirthday, setShowBirthday] = useState(() => {
    const devReminderPreview = import.meta.env.DEV && new URLSearchParams(window.location.search).has('reminders');
    return !devReminderPreview && window.localStorage.getItem('laoba:birthday-seen') !== '1';
  });

  function update(next: AppState) { setState(next); saveState(window.localStorage, next); }
  function saveReminder(item: Reminder) { update(upsertReminder(state, item)); setEditing(null); setView('week'); }
  function remove(item: Reminder) { if (window.confirm(`删除“${item.title}”吗？`)) update(deleteReminder(state, item.id)); }
  function complete(item: Occurrence) { update(completeOccurrence(state, item.reminderId, item.date)); }
  function exportCalendar(item: Occurrence) {
    downloadReminderIcs(item.reminder, item.date);
    update(upsertReminder(state, { ...item.reminder, calendarExportedAt: new Date().toISOString() }));
  }

  if (showBirthday) return <BirthdayBook config={birthdayConfig} onFinish={() => setShowBirthday(false)} />;

  if (editing) return <ReminderForm initial={editing === 'new' ? undefined : editing} onSave={saveReminder} onCancel={() => setEditing(null)} />;

  return <>
    {view === 'week' && <WeekView reminders={state.reminders} now={new Date()} onAdd={() => setEditing('new')} onComplete={complete} onCalendar={exportCalendar} />}
    {view === 'all' && <AllView reminders={state.reminders} onEdit={setEditing} onDelete={remove} />}
    {view === 'settings' && <Settings state={state} onRestore={update} onReplayBirthday={() => setShowBirthday(true)} />}
    <nav className="bottom-nav" aria-label="主导航">
      <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>本周</button>
      <button className={view === 'all' ? 'active' : ''} onClick={() => setView('all')}>全部事项</button>
      <button className={view === 'settings' ? 'active' : ''} onClick={() => setView('settings')}>设置</button>
    </nav>
  </>;
}
