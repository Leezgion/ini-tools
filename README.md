[English](#english) | [中文](#chinese)

<a id="english"></a>

# INI Tools

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Leezgion.vscode-ini?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![License](https://img.shields.io/github/license/Leezgion/ini-tools?style=flat-square)](./LICENSE)

A comprehensive toolkit for INI file support, including a high-performance parser library and a feature-rich Visual Studio Code extension.

> **Author:** Leezgion

## Project Structure

This repository is a monorepo managed by [Turbo](https://turbo.build/) and [pnpm](https://pnpm.io/), containing:

- **[vscode-ini](./packages/vscode-ini)**: The VS Code extension providing syntax highlighting, formatting, validation and Quick Fix.
- **[ini-parser](./packages/ini-parser)**: A robust TypeScript library for parsing, formatting, validating, and converting INI.

## Documentation

- VS Code extension
  - README: [packages/vscode-ini/README.md](./packages/vscode-ini/README.md)
  - Changelog: [packages/vscode-ini/CHANGELOG.md](./packages/vscode-ini/CHANGELOG.md)
- Parser library
  - README: [packages/ini-parser/README.md](./packages/ini-parser/README.md)

## Development

### Prerequisites

- Node.js >= 20
- pnpm >= 9

### Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

---

<a id="chinese"></a>

# INI 工具集

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Leezgion.vscode-ini?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![License](https://img.shields.io/github/license/Leezgion/ini-tools?style=flat-square)](./LICENSE)

一套完整的 INI 文件支持工具，包含高性能的解析库和功能丰富的 Visual Studio Code 插件。

> **作者：** Leezgion

## 项目结构

本项目是一个由 [Turbo](https://turbo.build/) 和 [pnpm](https://pnpm.io/) 管理的 Monorepo，包含：

- **[vscode-ini](./packages/vscode-ini)**：VS Code 插件，提供语法高亮、格式化、校验与 Quick Fix。
- **[ini-parser](./packages/ini-parser)**：TypeScript 解析库，支持解析、格式化、校验与转换。

## 文档入口

- VS Code 插件
  - README： [packages/vscode-ini/README.md](./packages/vscode-ini/README.md)
  - 更新日志： [packages/vscode-ini/CHANGELOG.md](./packages/vscode-ini/CHANGELOG.md)
- 解析库
  - README： [packages/ini-parser/README.md](./packages/ini-parser/README.md)

## 开发指南

### 环境要求

- Node.js >= 20
- pnpm >= 9

### 快速开始

```bash
# 安装依赖
pnpm install

# 构建所有包
pnpm build

# 运行测试
pnpm test
```
