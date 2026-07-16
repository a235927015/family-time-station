# 旅行照片方向自适应相框 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让竖图始终使用 3:4 相框、横图始终使用 4:3 相框，消除跨屏幕方向变化。

**Architecture:** 在 `TripStop` 数据中加入必填 `orientation`，由 `BirthdayBook` 映射为语义 class。CSS 通过 `aspect-ratio`、`max-width` 和视口高度约束决定相框尺寸，图片仍以 `object-fit: cover` 与单图焦点配置展示。

**Tech Stack:** React 19、TypeScript、CSS、Vitest、Vite

## Global Constraints

- 不运行时读取图片尺寸，方向由内容配置明确声明。
- 竖图相框为 3:4，横图相框为 4:3。
- 不拉伸图片，不改变现有翻页、重播或提醒逻辑。

---

### Task 1: 方向数据与渲染

**Files:**
- Modify: `src/features/birthday/trips.ts`
- Modify: `src/features/birthday/BirthdayBook.tsx`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Produces: `TripStop.orientation: 'portrait' | 'landscape'`。
- Consumes: `BirthdayBook` 使用方向生成 `trip-photo portrait` 或 `trip-photo landscape`。

- [ ] 在生日测试中断言芽庄图片容器为 `portrait`。
- [ ] 新增组件级测试，以一张横图配置断言容器为 `landscape`。
- [ ] 运行测试，确认因方向字段与 class 尚不存在而失败。
- [ ] 添加数据字段与 class，确认目标测试通过。

### Task 2: 响应式比例与视觉验证

**Files:**
- Modify: `src/features/birthday/birthday.css`

**Interfaces:**
- Consumes: `.trip-photo.portrait` 与 `.trip-photo.landscape`。
- Produces: 固定方向比例且受视口约束的照片框。

- [ ] 使用 `aspect-ratio: 3 / 4` 和 `aspect-ratio: 4 / 3` 定义两类相框。
- [ ] 使用 `max-width` 与 `max-height` 等效约束，避免宽屏竖图变横、矮屏溢出。
- [ ] 运行 25 个测试和生产构建。
- [ ] 在 390×844 与 760×900 视口截图检查芽庄照片。
- [ ] 同步 GitHub `main`，等待 Pages 成功并验证线上资源。
