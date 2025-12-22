[English](#english) | [中文](#chinese)

<a id="english"></a>

# INI Tools

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Leezgion.vscode-ini?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![License](https://img.shields.io/github/license/Leezgion/ini-tools?style=flat-square)](./LICENSE)

A comprehensive toolkit for INI file support, including a high-performance parser library and a feature-rich Visual Studio Code extension.

> **Author:** Leezgion

## Project Structure

This repository is a monorepo managed by [Turbo](https://turbo.build/) and [pnpm](https://pnpm.io/), containing:

- **[vscode-ini](./packages/vscode-ini)**: The VS Code extension providing syntax highlighting, formatting, and validation.
- **[ini-parser](./packages/ini-parser)**: A robust TypeScript library for parsing, formatting, and manipulating INI data.

## Features

### VS Code Extension

- **Syntax Highlighting**: Beautiful colors for sections, keys, values, and comments.
- **Formatting**: Auto-format with configurable spacing and alignment.
- **Validation**: Detect duplicate keys and sections.
- **Outline View**: Easy navigation through large files.
- **Snippets**: Quick templates for common configurations.

### Parser Library

- **Parse**: Convert INI strings to typed JavaScript objects.
- **Stringify**: Convert objects back to valid INI strings.
- **AST Access**: Low-level access to the Abstract Syntax Tree.
- **Preserve Comments**: Keep comments intact during round-trip operations.

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

- **[vscode-ini](./packages/vscode-ini)**: VS Code 插件，提供语法高亮、格式化和校验功能。
- **[ini-parser](./packages/ini-parser)**: 强大的 TypeScript 库，用于解析、格式化和操作 INI 数据。

## 功能特性

### VS Code 插件

- **语法高亮**：为节（Section）、键、值和注释提供精美的配色。
- **代码格式化**：支持自定义间距和对齐方式的自动格式化。
- **代码校验**：实时检测重复的键和节。
- **大纲视图**：轻松导航大型配置文件。
- **代码片段**：常用配置的快速模板。

### 解析库 (Parser Library)

- **解析**：将 INI 字符串转换为类型化的 JavaScript 对象。
- **序列化**：将对象转换回合法的 INI 字符串。
- **AST 访问**：提供对抽象语法树的底层访问能力。
- **保留注释**：在读写操作中完整保留注释信息。

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
