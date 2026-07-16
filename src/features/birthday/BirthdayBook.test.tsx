import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { BirthdayBook } from './BirthdayBook';

it('uses a landscape frame for a landscape trip photo', () => {
  render(<BirthdayBook config={{ coverTitle: '旅行', coverBody: '出发', stops: [{ image: '/wide.jpg', place: '海边', memory: '看海', orientation: 'landscape' }] }} onFinish={() => undefined} />);
  fireEvent.click(screen.getByRole('button', { name: '出发' }));
  expect(screen.getByRole('img', { name: '海边旅行照片' }).parentElement).toHaveClass('trip-photo', 'landscape');
});
