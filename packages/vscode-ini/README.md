[English](#english) | [中文](#chinese)

<a id="english"></a>

# INI Language Support

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Leezgion.vscode-ini?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/Leezgion.vscode-ini?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![License](https://img.shields.io/github/license/Leezgion/ini-tools?style=flat-square)](./LICENSE)

Full-featured INI file support for Visual Studio Code.

## Features

### 🎨 Syntax Highlighting

Beautiful, accurate syntax highlighting for INI files with support for:

- Sections `[SectionName]`
- Key-value pairs with `=` and `:` delimiters
- Comments with `;` and `#`
- Quoted strings, numbers, and booleans

### 📁 Code Folding

Collapse and expand sections for better navigation in large configuration files.

### 🗂️ Outline View

Quick overview of all sections and properties in the Explorer sidebar.

### ✂️ Code Snippets

Quick templates for common configurations:

| Prefix | Description            |
| ------ | ---------------------- |
| `sec`  | New section            |
| `prop` | New property           |
| `com`  | Comment                |
| `db`   | Database configuration |
| `srv`  | Server configuration   |
| `log`  | Logging configuration  |

### 📐 Formatting & Sorting

Auto-format INI documents with customizable options:

- Space around delimiters
- Value alignment
- Section spacing
- **Sorting**: Automatically sort sections and keys alphabetically (configurable).

### ✅ Validation

Real-time diagnostics for:

- Duplicate section names
- Duplicate keys within sections
- Empty sections (optional)

## Configuration

| Setting                                 | Default | Description                            |
| --------------------------------------- | ------- | -------------------------------------- |
| `ini.format.insertSpaces`               | `true`  | Insert spaces around delimiters        |
| `ini.format.alignValues`                | `false` | Align values in the same section       |
| `ini.format.sectionSpacing`             | `1`     | Empty lines between sections           |
| `ini.format.sortSections`               | `false` | Sort sections alphabetically on format |
| `ini.format.sortKeys`                   | `false` | Sort keys alphabetically on format     |
| `ini.validation.checkDuplicateSections` | `true`  | Check for duplicate sections           |
| `ini.validation.checkDuplicateKeys`     | `true`  | Check for duplicate keys               |

---

<a id="chinese"></a>

# INI 语言支持

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Leezgion.vscode-ini?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/Leezgion.vscode-ini?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![License](https://img.shields.io/github/license/Leezgion/ini-tools?style=flat-square)](./LICENSE)

Visual Studio Code 的全功能 INI 文件支持插件。

## 功能特性

### 🎨 语法高亮

为 INI 文件提供美观、精准的语法高亮，支持：

- 节（Sections） `[SectionName]`
- 使用 `=` 和 `:` 分隔的键值对
- 使用 `;` 和 `#` 的注释
- 引号字符串、数字和布尔值

### 📁 代码折叠

支持折叠和展开节，在大型配置文件中提供更好的导航体验。

### 🗂️ 大纲视图

在资源管理器侧边栏中快速预览所有节和属性。

### ✂️ 代码片段

常用配置的快速模板：

| 前缀   | 描述       |
| ------ | ---------- |
| `sec`  | 新建节     |
| `prop` | 新建属性   |
| `com`  | 注释       |
| `db`   | 数据库配置 |
| `srv`  | 服务器配置 |
| `log`  | 日志配置   |

### 📐 格式化与排序

支持自定义选项的自动格式化：

- 分隔符周围插入空格
- 值对齐
- 节间距控制
- **排序**：自动按字母顺序对节和键进行排序（可配置）。

### ✅ 代码校验

实时诊断以下问题：

- 重复的节名称
- 同一节内重复的键
- 空节（可选）

## 配置选项

| 设置项                                  | 默认值  | 描述                     |
| --------------------------------------- | ------- | ------------------------ |
| `ini.format.insertSpaces`               | `true`  | 在分隔符周围插入空格     |
| `ini.format.alignValues`                | `false` | 在同一节内对齐值         |
| `ini.format.sectionSpacing`             | `1`     | 节之间的空行数           |
| `ini.format.sortSections`               | `false` | 格式化时按字母顺序排序节 |
| `ini.format.sortKeys`                   | `false` | 格式化时按字母顺序排序键 |
| `ini.validation.checkDuplicateSections` | `true`  | 检查重复的节             |
| `ini.validation.checkDuplicateKeys`     | `true`  | 检查重复的键             |
