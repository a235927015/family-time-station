# 家庭时光局品牌调整 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将通用品牌统一为“家庭时光局”，保留爸爸生日惊喜，并发布到 GitHub Pages。

**Architecture:** 保持现有 React/Vite 结构和本地存储数据模型，仅修改可见品牌文案、导出标识与部署配置。旧存储键保持不变以兼容已有数据，GitHub Actions 负责构建与 Pages 部署。

**Tech Stack:** React 19、TypeScript、Vite、Vitest、GitHub Actions、GitHub Pages

## Global Constraints

- 通用品牌使用“家庭时光局”，生日祝福仍面向爸爸。
- 不迁移或清空现有 LocalStorage 数据。
- 不增加运行时依赖。

---

### Task 1: 品牌回归测试与文案调整

**Files:**
- Modify: `src/app/App.test.tsx`
- Modify: `src/features/birthday/BirthdayBook.tsx`
- Modify: `src/features/reminders/AllView.tsx`
- Modify: `src/features/reminders/ReminderForm.tsx`
- Modify: `src/features/reminders/Settings.tsx`
- Modify: `index.html`
- Modify: `package.json`
- Modify: `src/services/ics.ts`
- Modify: `README.md`

- [ ] 写测试，断言通用页面显示“家庭时光局”、不显示“老爸时光局”，生日结尾仍显示爸爸祝福。
- [ ] 运行目标测试并确认因旧品牌文案失败。
- [ ] 做最小文案与标识修改。
- [ ] 运行全部测试并确认通过。

### Task 2: GitHub Pages 自动部署

**Files:**
- Create: `.github/workflows/deploy-pages.yml`

- [ ] 添加 Node 20 安装、`npm ci`、测试、构建和 Pages 上传/部署步骤。
- [ ] 运行生产构建，确认相对资源路径可用于仓库子目录。
- [ ] 提交并推送 `main`。
- [ ] 检查 Actions 与公开 Pages 地址，直到部署成功或得到明确错误。
