import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { App } from './App';
import { STATE_KEY, type AppState } from '../services/reminderStore';

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(new Date(2026, 6, 16, 12));
});

function startWith(reminders: AppState['reminders'] = []) {
  localStorage.setItem('laoba:birthday-seen', '1');
  localStorage.setItem(STATE_KEY, JSON.stringify({ version: 1, reminders, samplesDismissed: true }));
}

it('shows the reminder home shell', () => {
  startWith();
  render(<App />);

  expect(screen.getByText('家庭时光局')).toBeInTheDocument();
  expect(screen.queryByText('老爸时光局')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /这周/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /添加/ })).toBeInTheDocument();
});

it('adds a monthly reminder and keeps it after remount', async () => {
  startWith();
  const first = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '添加提醒' }));
  fireEvent.change(screen.getByLabelText('要提醒什么？'), { target: { value: '收 3 号房房租' } });
  fireEvent.click(screen.getByRole('button', { name: '每月' }));
  fireEvent.change(screen.getByLabelText('每月几号？'), { target: { value: '17' } });
  fireEvent.click(screen.getByRole('button', { name: '提前1天' }));
  fireEvent.click(screen.getByRole('button', { name: '保存提醒' }));

  expect(await screen.findByText('收 3 号房房租')).toBeInTheDocument();
  first.unmount();
  render(<App />);
  expect(screen.getByText('收 3 号房房租')).toBeInTheDocument();
  await waitFor(() => expect(JSON.parse(localStorage.getItem(STATE_KEY)!).reminders).toHaveLength(1));
});

it('navigates to all reminders and settings', () => {
  startWith();
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '全部事项' }));
  expect(screen.getByRole('heading', { name: '全部事项' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '设置' }));
  expect(screen.getByRole('heading', { name: '设置' })).toBeInTheDocument();
  expect(screen.getByText(/只保存在这台手机/)).toBeInTheDocument();
});

it('completes, edits, and deletes a reminder', () => {
  startWith([{ id: 'weekly', title: '给花浇水', recurrence: { kind: 'weekly', weekday: 4 }, leadDays: 0, createdAt: '2026-07-16T00:00:00.000Z', updatedAt: '2026-07-16T00:00:00.000Z', completedDates: [] }]);
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: '完成了' }));
  expect(screen.getByText('还没有要记的事')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: '全部事项' }));
  fireEvent.click(screen.getByRole('button', { name: '修改' }));
  fireEvent.change(screen.getByLabelText('要提醒什么？'), { target: { value: '周六给花浇水' } });
  fireEvent.click(screen.getByRole('button', { name: '保存提醒' }));
  fireEvent.click(screen.getByRole('button', { name: '全部事项' }));
  expect(screen.getByText('周六给花浇水')).toBeInTheDocument();

  vi.spyOn(window, 'confirm').mockReturnValue(true);
  fireEvent.click(screen.getByRole('button', { name: '删除' }));
  expect(screen.getByText('还没有要记的事')).toBeInTheDocument();
});

it('shows the birthday journey once and finishes at the reminder tool', () => {
  localStorage.setItem(STATE_KEY, JSON.stringify({ version: 1, reminders: [], samplesDismissed: true }));
  render(<App />);
  expect(screen.getByRole('heading', { name: /熟悉的风景/ })).toBeInTheDocument();
  expect(document.querySelector('audio')).toBeNull();
  expect(screen.queryByRole('button', { name: /音乐/ })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '出发' }));
  expect(screen.getByText('越南 · 芽庄')).toBeInTheDocument();
  expect(screen.getByText('路边停一下，椰子当然要趁新鲜喝。')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: '越南 · 芽庄旅行照片' })).toHaveAttribute('src', expect.stringContaining('trips/01.jpg'));
  fireEvent.click(screen.getByRole('button', { name: '跳过旅行照片' }));
  expect(screen.getByText('家庭时光局')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /爸，生日快乐/ })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /礼物在这儿/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: '打开我的提醒工具' }));
  expect(localStorage.getItem('laoba:birthday-seen')).toBe('1');
  expect(screen.getByRole('heading', { name: /这周/ })).toBeInTheDocument();
});
