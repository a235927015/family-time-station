# 生日旅行册取消音乐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从生日旅行册中完全移除不可靠的音乐功能，同时保留首次观看与重复观看流程。

**Architecture:** 删除 `BirthdayBook` 的音频元素、引用、播放状态和事件处理；配置模型不再提供音乐地址。现有生日展示状态与设置页重播回调不变。

**Tech Stack:** React 19、TypeScript、Vitest、Vite

## Global Constraints

- 不增加依赖或外部音频服务。
- 不修改现有 LocalStorage 兼容键。
- 不改变生日旅行册的进入、完成和重播流程。

---

### Task 1: 移除音乐功能

**Files:**
- Modify: `src/app/App.test.tsx`
- Modify: `src/features/birthday/BirthdayBook.tsx`
- Modify: `src/features/birthday/trips.ts`
- Delete: `public/audio/README.txt`
- Delete: `src/assets/audio/README.md`

**Interfaces:**
- Consumes: `BirthdayConfig` 及现有 `BirthdayBook` 组件属性。
- Produces: 不含 `music` 属性的 `BirthdayConfig`，以及不渲染音频控件的 `BirthdayBook`。

- [ ] **Step 1: 写失败测试**

在生日流程测试中断言 `document.querySelector('audio')` 为 `null`，且不存在名称匹配“音乐”的按钮。

- [ ] **Step 2: 验证测试失败**

Run: `npm.cmd test -- src/app/App.test.tsx -t birthday`
Expected: FAIL，因为当前页面仍含 `<audio>` 与“播放音乐”按钮。

- [ ] **Step 3: 最小实现**

删除音频引用、播放状态、`toggleMusic`、音频元素、音乐按钮与 `BirthdayConfig.music`。

- [ ] **Step 4: 验证测试和构建**

Run: `npm.cmd test && npm.cmd run build`
Expected: 25 tests pass，构建退出码为 0。

- [ ] **Step 5: 发布**

提交变更并同步到 `a235927015/family-time-station` 的 `main`，等待 GitHub Pages 工作流成功后验证公开页面。
