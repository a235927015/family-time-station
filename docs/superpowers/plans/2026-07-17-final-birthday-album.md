# 家庭旅行册最终内容 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用 12 张真实旅行照片和更完整的生日祝福完成家庭旅行册最终版。

**Architecture:** `trips.ts` 作为照片顺序、地点、文案和比例的唯一数据源；`BirthdayBook` 只根据配置渲染。CSS 在现有竖图与横图相框之外增加 16:9 宽图相框，静态资源统一放在 `public/trips`。

**Tech Stack:** React 19、TypeScript、CSS、Vitest、Vite、GitHub Pages

## Global Constraints

- 图片顺序严格取文件名 1 至 12。
- 不拉伸、不滤镜，不虚构照片日期或具体故事。
- 保留现有翻页、跳过、重看和提醒功能。
- 结尾温暖但不过度煽情。

---

### Task 1: 锁定 12 站内容

**Files:**
- Create: `src/features/birthday/trips.test.ts`
- Modify: `src/features/birthday/trips.ts`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Produces: `birthdayConfig.stops` 含 12 个按序的 `TripStop`。
- Consumes: `BirthdayBook` 从配置读取图片、地点、文案和方向。

- [ ] 写失败测试，断言 12 个地点、图片文件名和方向顺序。
- [ ] 运行目标测试，确认旧的 10 站示例数据导致失败。
- [ ] 更新配置与生日流程断言，使第一站为海南三亚且进度为 `01 / 12`。
- [ ] 再次运行目标测试并确认通过。

### Task 2: 支持 16:9 宽图并扩写结尾

**Files:**
- Modify: `src/features/birthday/BirthdayBook.test.tsx`
- Modify: `src/features/birthday/BirthdayBook.tsx`
- Modify: `src/features/birthday/birthday.css`

**Interfaces:**
- Produces: `TripStop.orientation` 支持 `wide`，渲染 `.trip-photo.wide`。
- Produces: 结尾页包含两段祝福和原有礼物票。

- [ ] 写失败测试，断言宽图 class 与新增祝福文案。
- [ ] 运行目标测试，确认类型或文案断言失败。
- [ ] 添加 `wide` 类型、16:9 相框和两段结尾祝福。
- [ ] 运行目标测试并确认通过。

### Task 3: 复制、验证和发布

**Files:**
- Create: `public/trips/02.jpg` 至 `public/trips/12.jpg`
- Modify: `public/trips/01.jpg`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `picture/1...12*.jpg` 用户原图。
- Produces: `public/trips/01.jpg` 至 `12.jpg` 部署资源。

- [ ] 按编号复制 12 张图片并校验尺寸、数量和文件名。
- [ ] 把 `picture/` 加入 `.gitignore`，保留用户原图但不重复提交。
- [ ] 运行完整测试与生产构建。
- [ ] 用移动端视口逐页检查照片与结尾页。
- [ ] 提交并同步 GitHub `main`，等待 Pages 部署成功后检查线上页面。
