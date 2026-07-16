import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BirthdayBook } from './BirthdayBook';

it('uses a landscape frame for a landscape trip photo', () => {
  render(<BirthdayBook config={{ coverTitle: '旅行', coverBody: '出发', stops: [{ image: '/wide.jpg', place: '海边', memory: '看海', orientation: 'landscape' }] }} onFinish={() => undefined} />);
  fireEvent.click(screen.getByRole('button', { name: '出发' }));
  expect(screen.getByRole('img', { name: '海边旅行照片' }).parentElement).toHaveClass('trip-photo', 'landscape');
  expect(screen.getByText('01 / 01')).toHaveClass('trip-count');
});

it('uses a wide frame for a 16:9 trip photo', () => {
  render(<BirthdayBook config={{ coverTitle: '旅行', coverBody: '出发', stops: [{ image: '/wide.jpg', place: '伊犁', memory: '看雪山', orientation: 'wide' }] }} onFinish={() => undefined} />);
  fireEvent.click(screen.getByRole('button', { name: '出发' }));
  expect(screen.getByRole('img', { name: '伊犁旅行照片' }).parentElement).toHaveClass('trip-photo', 'wide');
});

it('ends with a longer but restrained birthday wish', () => {
  render(<BirthdayBook config={{ coverTitle: '旅行', coverBody: '出发', stops: [{ image: '/photo.jpg', place: '三亚', memory: '旅行', orientation: 'landscape' }] }} onFinish={() => undefined} />);
  fireEvent.click(screen.getByRole('button', { name: '出发' }));
  fireEvent.click(screen.getByRole('button', { name: '跳过旅行照片' }));

  expect(screen.getByRole('heading', { name: /下一站继续出发/ })).toBeInTheDocument();
  expect(screen.getByText(/祝你身体健康，吃得香、睡得好/)).toBeInTheDocument();
  expect(screen.getByText(/你和妈妈继续安排下一趟旅行/)).toBeInTheDocument();
});
