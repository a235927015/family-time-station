# 老爸时光局第一版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可部署的移动网页，首次展示旅行照片生日册，之后提供本地保存的一次性、每周、每月和每年周期提醒及手机日历导出。

**Architecture:** 使用 Vite、React 与 TypeScript 构建单页应用。周期计算、存储、备份和 ICS 导出均为无界面的独立模块，React 组件只负责状态编排与展示；旅行内容集中在配置文件中，真实素材可无代码替换。

**Tech Stack:** Node.js 24、npm 11、Vite、React、TypeScript、Vitest、Testing Library、原生 CSS、浏览器 LocalStorage、标准 ICS 文件。

## Global Constraints

- 移动端正文默认不小于 16px，主要触控区域不小于 48px。
- 爸爸和妈妈的事项只保存在各自手机，不提供登录、服务器或跨设备同步。
- 支持一次性、每周、每月和每年周期；每月 29、30、31 日在短月份落到当月最后一天。
- 音乐默认静音，必须由用户主动开启；所有动效尊重 `prefers-reduced-motion`。
- 生日册使用深森林绿、冷白和单一橙色强调，文案轻松克制；提醒工具优先易读易点。
- `design-taste-frontend` 只用于颜色、排版、触控反馈、动效与交付检查，不套用营销页信息架构。
- 首版不包含微信订阅消息、农历、在线地图、AI 识图或家庭共同编辑。

---

## File Structure

```text
package.json                         scripts and dependency contract
vite.config.ts                      Vite and Vitest configuration
src/main.tsx                        application entry
src/app/App.tsx                     route-like view orchestration
src/app/App.test.tsx                end-to-end component flow tests
src/styles/tokens.css               palette, type, spacing and motion tokens
src/styles/global.css               resets, layout and accessibility rules
src/domain/reminder.ts              reminder types and validation
src/domain/recurrence.ts            pure recurrence calculations
src/domain/recurrence.test.ts       month-end and boundary tests
src/services/reminderStore.ts       versioned LocalStorage repository
src/services/reminderStore.test.ts  persistence and corruption tests
src/services/backup.ts              JSON export/import validation
src/services/backup.test.ts         backup round-trip and rejection tests
src/services/ics.ts                 standard calendar text generation
src/services/ics.test.ts            ICS recurrence tests
src/features/reminders/WeekView.tsx current week and overdue list
src/features/reminders/ReminderForm.tsx add/edit form
src/features/reminders/AllView.tsx  all reminder management
src/features/reminders/Settings.tsx backup, restore and replay controls
src/features/reminders/reminders.css reminder product UI
src/features/birthday/trips.ts      replaceable travel content
src/features/birthday/BirthdayBook.tsx first-open story controller
src/features/birthday/birthday.css  photo-first film-book presentation
src/assets/trips/README.md           exact asset naming and crop guidance
src/assets/audio/README.md           music replacement guidance
public/favicon.svg                  application icon
README.md                           local run, content replacement and deploy
```

---

### Task 1: Runnable React and Test Foundation

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/app/App.test.tsx`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

**Interfaces:**
- Produces: `App(): JSX.Element`, `npm run dev`, `npm test`, `npm run build`.

- [ ] **Step 1: Create package and TypeScript configuration**

Use a module package with scripts `dev: vite`, `build: tsc -b && vite build`, `test: vitest run`, and `test:watch: vitest`. Add runtime dependencies `react` and `react-dom`; add development dependencies `@vitejs/plugin-react`, `vite`, `typescript`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, and React type packages.

- [ ] **Step 2: Write the failing shell test**

Run:

```powershell
npm.cmd install
npm.cmd test
```

Expected: FAIL because `src/app/App.test.tsx` does not exist yet.

- [ ] **Step 3: Add the first component test**

```tsx
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { App } from './App';

it('shows the reminder home shell', () => {
  localStorage.setItem('laoba:birthday-seen', '1');
  render(<App />);
  expect(screen.getByRole('heading', { name: /这周/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /添加/ })).toBeInTheDocument();
});
```

- [ ] **Step 4: Implement the minimal application shell and tokens**

`App.tsx` renders a `main` element with heading “这周还没有事情” and button “添加提醒”. Define CSS variables `--ink: #173c32`, `--paper: #f7f8f3`, `--accent: #ef6a3a`, `--muted: #6e7974`, `--line: #d9dfda`, radius `16px`, and a minimum button height of `48px`. Import both CSS files from `main.tsx`.

- [ ] **Step 5: Verify test and production build**

Run:

```powershell
npm.cmd test
npm.cmd run build
```

Expected: one passing test and a successful `dist` build.

- [ ] **Step 6: Commit**

```powershell
git add package.json package-lock.json vite.config.ts tsconfig.json index.html src
git commit -m "chore: scaffold reminder web app"
```

---

### Task 2: Reminder Model and Recurrence Engine

**Files:**
- Create: `src/domain/reminder.ts`
- Create: `src/domain/recurrence.ts`
- Create: `src/domain/recurrence.test.ts`

**Interfaces:**
- Produces: `Reminder`, `Recurrence`, `Occurrence`, `validateReminder(input)`, `nextOccurrence(reminder, from)`, `occurrencesBetween(reminder, start, end)`.

- [ ] **Step 1: Define domain types and failing recurrence tests**

```ts
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
```

Tests must assert: monthly day 31 resolves to 2026-02-28; yearly February 29 resolves to 2027-02-28; weekly Monday after a Monday occurrence moves seven days; completed occurrence is excluded without removing the next one; ranges include overdue and current-week dates.

- [ ] **Step 2: Run the recurrence tests and confirm failure**

Run: `npm.cmd test -- src/domain/recurrence.test.ts`

Expected: FAIL because recurrence functions are not implemented.

- [ ] **Step 3: Implement date-only helpers and recurrence functions**

Use local date construction at noon to avoid daylight-saving rollover. Add `toDateKey(date): YYYY-MM-DD`, `daysInMonth(year, month)`, `clampedDate(year, month, day)`, and deterministic forward iteration capped at 400 occurrences. `nextOccurrence` must skip dates present in `completedDates`.

- [ ] **Step 4: Add validation tests and implementation**

Verify trimmed title is 1 to 60 characters; weekday is 0 to 6; monthly day is 1 to 31; yearly month is 1 to 12 and day is valid for at least one year; lead days is 0, 1 or 3. Return `{ ok: true, value }` or `{ ok: false, field, message }` with Chinese messages such as “请写下要提醒的事情”.

- [ ] **Step 5: Run tests**

Run: `npm.cmd test -- src/domain`

Expected: all domain tests PASS.

- [ ] **Step 6: Commit**

```powershell
git add src/domain
git commit -m "feat: add recurring reminder engine"
```

---

### Task 3: Versioned Storage and Sample Data

**Files:**
- Create: `src/services/reminderStore.ts`
- Create: `src/services/reminderStore.test.ts`

**Interfaces:**
- Consumes: `Reminder` from `src/domain/reminder.ts`.
- Produces: `loadState(storage)`, `saveState(storage, state)`, `upsertReminder`, `deleteReminder`, `completeOccurrence`, `createSampleState`.

- [ ] **Step 1: Write failing repository tests**

Test a versioned envelope:

```ts
interface AppState { version: 1; reminders: Reminder[]; samplesDismissed: boolean }
```

Assert empty storage returns three clearly marked samples; save then load preserves reminders; upsert replaces matching ID; delete removes only the selected item; completing `2026-07-17` adds only that date; malformed JSON returns sample state and writes the raw value to `laoba:recovery:<timestamp>`.

- [ ] **Step 2: Run and confirm failure**

Run: `npm.cmd test -- src/services/reminderStore.test.ts`

Expected: FAIL with missing module.

- [ ] **Step 3: Implement the storage repository**

Use key `laoba:state:v1`. Never call `localStorage` at module import time; accept the `Storage` interface so tests can supply a memory implementation. Sample titles are “收房租（示例）”, “给花浇水（示例）”, and “家人生日（示例）”.

- [ ] **Step 4: Verify repository tests**

Run: `npm.cmd test -- src/services/reminderStore.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/services/reminderStore.ts src/services/reminderStore.test.ts
git commit -m "feat: persist reminders locally"
```

---

### Task 4: Backup, Restore and Calendar Export

**Files:**
- Create: `src/services/backup.ts`
- Create: `src/services/backup.test.ts`
- Create: `src/services/ics.ts`
- Create: `src/services/ics.test.ts`

**Interfaces:**
- Produces: `exportBackup(state): string`, `parseBackup(text): ParseResult`, `buildIcs(reminder, occurrence): string`, `downloadTextFile(name, content, mime)`.

- [ ] **Step 1: Write failing backup tests**

Assert export and import round-trip retains all reminders; wrong version returns “这个备份版本暂不支持”; malformed JSON returns “备份文件无法读取”; invalid recurrence does not alter current state.

- [ ] **Step 2: Write failing ICS tests**

Assert CRLF line endings, escaped commas and semicolons, all-day `DTSTART;VALUE=DATE`, `RRULE:FREQ=WEEKLY;BYDAY=`, `FREQ=MONTHLY;BYMONTHDAY=`, and `FREQ=YEARLY;BYMONTH=;BYMONTHDAY=`. Once-only reminders omit RRULE.

- [ ] **Step 3: Run tests and confirm failure**

Run: `npm.cmd test -- src/services/backup.test.ts src/services/ics.test.ts`

Expected: FAIL with missing modules.

- [ ] **Step 4: Implement strict backup parsing and ICS generation**

Backup parsing must build a new validated state and return it without saving. ICS output includes `BEGIN:VCALENDAR`, `VERSION:2.0`, stable UID `${reminder.id}@laoba-time-station`, `SUMMARY`, `DTSTART`, optional RRULE, and `END:VCALENDAR`. `downloadTextFile` uses Blob, a temporary object URL and a temporary anchor, then revokes the URL.

- [ ] **Step 5: Verify tests and commit**

Run: `npm.cmd test -- src/services/backup.test.ts src/services/ics.test.ts`

Expected: PASS.

```powershell
git add src/services/backup* src/services/ics*
git commit -m "feat: add backup and calendar export"
```

---

### Task 5: Reminder Product Interface

**Files:**
- Create: `src/features/reminders/WeekView.tsx`
- Create: `src/features/reminders/ReminderForm.tsx`
- Create: `src/features/reminders/AllView.tsx`
- Create: `src/features/reminders/Settings.tsx`
- Create: `src/features/reminders/reminders.css`
- Modify: `src/app/App.tsx`
- Expand: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: recurrence functions, repository, backup and ICS services.
- Produces: full add/edit/delete/complete/navigation user flow.

- [ ] **Step 1: Add failing interaction tests**

Testing Library tests must use visible Chinese labels to: add “收 3 号房房租” as monthly day 17 with one-day lead; see it on 本周 or 全部事项; edit its title; complete the current occurrence; cancel deletion once and confirm deletion once; navigate among 本周、全部事项、设置; export backup; reject a bad import without losing data.

- [ ] **Step 2: Run and confirm failure**

Run: `npm.cmd test -- src/app/App.test.tsx`

Expected: FAIL because feature components do not exist.

- [ ] **Step 3: Implement `ReminderForm`**

Use controlled fields `title`, `kind`, `date/weekday/day/month`, and `leadDays`. Show only fields relevant to the selected kind. Buttons read “每周”“每月”“每年”; errors render with `role="alert"`; Save calls `onSave(validReminder)`; Cancel does not mutate state.

- [ ] **Step 4: Implement lists and actions**

`WeekView` groups overdue, today, and later-this-week occurrences. The first item has “完成了” and “加入手机日历”; other rows expose the same actions in a compact menu. `AllView` groups by recurrence type and includes edit/delete. Delete uses a native confirm dialog in v1. Empty state reads “还没有要记的事”.

- [ ] **Step 5: Implement settings and application orchestration**

`App` owns the loaded `AppState`, current view and optional editing reminder. Every mutation immediately calls `saveState`. `Settings` downloads backup, accepts `.json`, validates before confirmation, provides “重看生日旅行册”, and explains “这台手机的数据只保存在这台手机里”.

- [ ] **Step 6: Apply accessible product styling**

Use a single-column mobile layout up to 640px, maximum content width 720px, sticky bottom navigation with safe-area padding, 16px body, 28px page heading, 48px controls, visible focus rings, AA contrast, and `:active { transform: scale(.98) }`. Do not use decorative cards for every row; use spacing and sparse dividers after the featured item.

- [ ] **Step 7: Run component tests and build**

Run:

```powershell
npm.cmd test -- src/app/App.test.tsx
npm.cmd run build
```

Expected: all interaction tests PASS and build succeeds.

- [ ] **Step 8: Commit**

```powershell
git add src/app src/features/reminders
git commit -m "feat: build reminder management interface"
```

---

### Task 6: Travel Birthday Book

**Files:**
- Create: `src/features/birthday/trips.ts`
- Create: `src/features/birthday/BirthdayBook.tsx`
- Create: `src/features/birthday/birthday.css`
- Create: `src/assets/trips/README.md`
- Create: `src/assets/audio/README.md`
- Modify: `src/app/App.tsx`
- Expand: `src/app/App.test.tsx`

**Interfaces:**
- Produces: `TripStop`, `BirthdayConfig`, `BirthdayBook({ config, onFinish })`.

- [ ] **Step 1: Add failing birthday flow tests**

Assert a new browser shows “爸，先看几张熟悉的风景”; music is not autoplayed; “出发” advances to the first stop; next/previous and skip work; final page says “爸，生日快乐。礼物在这儿。”; finish stores `laoba:birthday-seen=1`; later reload starts on reminder home; settings replay does not clear reminders.

- [ ] **Step 2: Run and confirm failure**

Run: `npm.cmd test -- src/app/App.test.tsx -t birthday`

Expected: FAIL because `BirthdayBook` does not exist.

- [ ] **Step 3: Create replaceable content configuration**

Define 10 placeholder stops with file paths `/trips/01.jpg` through `/trips/10.jpg`, place strings, and clearly marked sample memories. Config contains short cover copy, final copy, and optional `/audio/birthday.mp3`. Document that real files retain these names or the config paths must be changed.

- [ ] **Step 4: Implement story controller and media behavior**

Use reducer states `cover`, `stop`, `summary`, `gift`. Auto-advance only after user presses “出发”; provide visible previous, next, pause, mute and skip buttons. Attach audio playback only inside a click handler and catch rejection. Broken images render a colored placeholder with the location. Preload only the next image.

- [ ] **Step 5: Implement photo-first visual treatment**

Use forest green, cold white and orange tokens. Photos fill most of the viewport with `object-fit: cover`; allow per-stop `objectPosition` for face-safe crop. Limit each stop to location, count and one memory line. Animate only opacity and translate for 240ms; disable transitions and autoplay under `prefers-reduced-motion: reduce`.

- [ ] **Step 6: Verify birthday flow, all tests and build**

Run:

```powershell
npm.cmd test
npm.cmd run build
```

Expected: all tests PASS and build succeeds.

- [ ] **Step 7: Commit**

```powershell
git add src/features/birthday src/assets src/app
git commit -m "feat: add travel birthday story"
```

---

### Task 7: Delivery Documentation and Final QA

**Files:**
- Create: `README.md`
- Create: `public/favicon.svg`
- Modify: `index.html`
- Modify: `.gitignore`

**Interfaces:**
- Produces: repeatable local preview, asset replacement guide and deployment-ready `dist`.

- [ ] **Step 1: Write the delivery guide**

Document exact commands `npm.cmd install`, `npm.cmd run dev -- --host 0.0.0.0`, `npm.cmd test`, and `npm.cmd run build`; explain how to replace ten photos, locations, memories and music; explain local-only data, backup, WeChat ICS limitation, and how to deploy `dist` to any static HTTPS host.

- [ ] **Step 2: Add application metadata**

Set title “老爸时光局”, description “旅行回忆与家庭周期提醒”, theme color `#173c32`, viewport with `viewport-fit=cover`, and a simple non-decorative favicon matching the forest and orange palette.

- [ ] **Step 3: Run the taste-skill pre-flight subset relevant to this product**

Check one accent color, consistent radii, button contrast, input contrast, readable copy, no fake data presented as real, reduced motion, mobile single column, no scroll listener, complete empty/error states, and no generic birthday-card palette. Record fixes directly in the affected CSS or component.

- [ ] **Step 4: Run automated verification**

```powershell
npm.cmd test
npm.cmd run build
```

Expected: zero failing tests and successful production build.

- [ ] **Step 5: Run browser verification**

Preview the production build, inspect at 320x700, 390x844 and 430x932, test birthday finish, add/edit/complete/delete, reload persistence, backup restore and ICS download, then inspect browser console for errors. If actual iPhone and Android devices are unavailable, document those two physical-device checks as remaining handoff checks rather than claiming completion.

- [ ] **Step 6: Commit**

```powershell
git add README.md public index.html .gitignore src
git commit -m "docs: prepare first version delivery"
```

