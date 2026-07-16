import { useRef, useState } from 'react';
import { downloadTextFile, exportBackup, parseBackup } from '../../services/backup';
import type { AppState } from '../../services/reminderStore';

interface Props { state: AppState; onRestore: (state: AppState) => void; onReplayBirthday: () => void }
export function Settings({ state, onRestore, onReplayBirthday }: Props) {
  const input = useRef<HTMLInputElement>(null); const [message, setMessage] = useState('');
  async function importFile(file?: File) {
    if (!file) return; const result = parseBackup(await file.text());
    if (!result.ok) { setMessage(result.message); return; }
    if (window.confirm(`将恢复 ${result.state.reminders.length} 件事项，继续吗？`)) { onRestore(result.state); setMessage('恢复完成'); }
  }
  return <main className="app-shell with-nav"><header className="simple-header"><p className="eyebrow">家庭时光局</p><h1>设置</h1></header>
    <section className="setting-section"><h2>这台手机的数据</h2><p>这台手机的数据只保存在这台手机里，不会上传。换手机前记得导出备份。</p><div className="setting-actions"><button className="secondary-button" onClick={() => downloadTextFile('家庭时光局备份.json', exportBackup(state), 'application/json')}>导出备份</button><button className="secondary-button" onClick={() => input.current?.click()}>导入恢复</button><input ref={input} hidden type="file" accept="application/json,.json" onChange={(e) => importFile(e.target.files?.[0])} /></div>{message && <p role="status">{message}</p>}</section>
    <section className="setting-section"><h2>生日旅行册</h2><p>想再翻一遍旅行照片，可以从这里重新打开。</p><button className="secondary-button" onClick={onReplayBirthday}>重看生日旅行册</button></section>
  </main>;
}
