[English](#english) | [中文](#chinese)

<a id="english"></a>

# INI Language Support

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Leezgion.vscode-ini?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/Leezgion.vscode-ini?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![License](https://img.shields.io/github/license/Leezgion/ini-tools?style=flat-square)](./LICENSE)

Full-featured INI file support for Visual Studio Code.

## Features

### 🎨 Syntax Highlighting

Accurate syntax highlighting for INI files, including:

- Sections: `[SectionName]`
- Properties with `=` and `:` delimiters
- Comments with `;` and `#`
- Quoted strings, numbers, and booleans

### 📁 Code Folding

Collapse and expand sections for easier navigation in large files.

### 🗂️ Outline View

Browse sections and properties from the Explorer outline.

### ✂️ Snippets

Quick templates for common patterns:

| Prefix | Description            |
| ------ | ---------------------- |
| `sec`  | New section            |
| `prop` | New property           |
| `com`  | Comment                |
| `db`   | Database configuration |
| `srv`  | Server configuration   |
| `log`  | Logging configuration  |

### 📐 Formatting & Sorting

Format INI documents with configurable options:

- Spaces around delimiters
- Value alignment within a section
- Section spacing
- Optional sorting (sections and/or keys)

### ✅ Validation

Real-time diagnostics for:

- Duplicate section names
- Duplicate keys within sections
- Empty sections (optional)

### 🛠️ Quick Fix (Code Actions)

For duplicate keys/sections, Quick Fix actions are available:

- **Go to first definition** (jump to the first occurrence)
- **Rename duplicate** (append `_2`, `_3`, ... to make it unique)
- **Delete duplicate** (safe delete the current duplicate)

## Commands

- `INI: Format INI Document` (`ini.format`)
- `INI: Convert INI to JSON` (`ini.convertToJson`)
- `INI: Sort Sections Alphabetically` (`ini.sortSections`)
- `INI: Sort Keys Alphabetically` (`ini.sortKeys`)

## Keybindings

Default keybindings:

- Format: `Ctrl+Alt+F` (macOS: `Cmd+Alt+F`)
- Convert to JSON: `Ctrl+Alt+J` (macOS: `Cmd+Alt+J`)

## Configuration

### Formatting

| Setting                         | Default | Description |
| ------------------------------ | ------- | ----------- |
| `ini.format.insertSpaces`       | `true`  | Insert spaces around delimiters |
| `ini.format.alignValues`        | `false` | Align values within the same section |
| `ini.format.sectionSpacing`     | `1`     | Blank lines between sections |
| `ini.format.sortSections`       | `false` | Sort sections alphabetically during formatting |
| `ini.format.sortKeys`           | `false` | Sort keys alphabetically during formatting |
| `ini.format.delimiter`          | `=`     | Delimiter to use when formatting (`=` or `:`) |
| `ini.format.preserveDelimiters` | `false` | Preserve the original delimiter per property |

Notes:

- When `ini.format.preserveDelimiters` is `true`, each property keeps its original delimiter (`:` vs `=`).
- When `ini.format.preserveDelimiters` is `false`, the formatter uses `ini.format.delimiter` consistently.

### Parsing

| Setting                        | Default  | Description |
| ----------------------------- | -------- | ----------- |
| `ini.parse.inlineCommentMode` | `legacy` | Inline comment mode: `legacy` \| `smart` \| `none` |

Modes:

- `legacy`: backward compatible; strips content after the first `;` or `#` found in the value.
- `smart`: quote-aware; strips only when the marker is **outside quotes** and **preceded by whitespace**.
- `none`: keeps values as-is (no inline comment stripping).

### Validation

| Setting                                 | Default | Description |
| --------------------------------------- | ------- | ----------- |
| `ini.validation.checkDuplicateSections` | `true`  | Check for duplicate section names |
| `ini.validation.checkDuplicateKeys`     | `true`  | Check for duplicate keys |
| `ini.validation.checkEmptySections`     | `false` | Check for empty sections |

## Recommended Settings

Preserve `:` delimiters and use quote-aware inline comment handling:

```json
{
  "ini.format.preserveDelimiters": true,
  "ini.parse.inlineCommentMode": "smart"
}
```

Force `:` delimiter on formatting:

```json
{
  "ini.format.delimiter": ":",
  "ini.format.preserveDelimiters": false
}
```

---

<a id="chinese"></a>

# INI 语言支持

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Leezgion.vscode-ini?style=flat-square&label=VS%20Code%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/Leezgion.vscode-ini?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=Leezgion.vscode-ini)
[![License](https://img.shields.io/github/license/Leezgion/ini-tools?style=flat-square)](./LICENSE)

为 Visual Studio Code 提供全功能 INI 文件支持。

## 功能特性

### 🎨 语法高亮

为 INI 文件提供美观、精准的语法高亮，支持：

- 节（Sections）：`[SectionName]`
- 使用 `=` 和 `:` 分隔的键值对
- 使用 `;` 和 `#` 的注释
- 引号字符串、数字和布尔值

### 📁 代码折叠

支持折叠/展开节，便于在大型配置文件中导航。

### 🗂️ 大纲视图

在资源管理器侧边栏查看节和属性的大纲。

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
- 同一节内对齐值
- 节间距控制
- 可选排序（节/键按字母顺序）

### ✅ 代码校验

实时诊断以下问题：

- 重复的节名称
- 同一节内重复的键
- 空节（可选）

### 🛠️ Quick Fix（代码操作）

当检测到重复键/重复节时，提供 Quick Fix：

- **跳转到首次定义**（定位到第一次出现的位置）
- **自动重命名重复项**（追加 `_2`、`_3`... 生成不冲突名称）
- **删除当前重复项**（安全删除当前重复行/重复节块）

## 命令

- `INI: Format INI Document`（`ini.format`）
- `INI: Convert INI to JSON`（`ini.convertToJson`）
- `INI: Sort Sections Alphabetically`（`ini.sortSections`）
- `INI: Sort Keys Alphabetically`（`ini.sortKeys`）

## 快捷键

默认快捷键：

- 格式化：`Ctrl+Alt+F`（macOS：`Cmd+Alt+F`）
- 转 JSON：`Ctrl+Alt+J`（macOS：`Cmd+Alt+J`）

## 配置选项

### 格式化

| 设置项                          | 默认值  | 描述 |
| ------------------------------ | ------- | ---- |
| `ini.format.insertSpaces`       | `true`  | 在分隔符周围插入空格 |
| `ini.format.alignValues`        | `false` | 同一节内对齐值 |
| `ini.format.sectionSpacing`     | `1`     | 节之间的空行数 |
| `ini.format.sortSections`       | `false` | 格式化时按字母顺序排序节 |
| `ini.format.sortKeys`           | `false` | 格式化时按字母顺序排序键 |
| `ini.format.delimiter`          | `=`     | 格式化时使用的分隔符（`=` 或 `:`） |
| `ini.format.preserveDelimiters` | `false` | 保留每条属性原始分隔符（保留 `:`/`=`） |

说明：

- 当 `ini.format.preserveDelimiters=true` 时，格式化会优先使用每条属性原本的分隔符。
- 当 `ini.format.preserveDelimiters=false` 时，格式化会统一使用 `ini.format.delimiter`。

### 解析

| 设置项                        | 默认值   | 描述 |
| ---------------------------- | -------- | ---- |
| `ini.parse.inlineCommentMode` | `legacy` | 行内注释处理：`legacy` \| `smart` \| `none` |

模式：

- `legacy`：兼容旧行为，值中出现 `;`/`#` 后会被截断。
- `smart`：引号感知，仅在**非引号内**且前面是**空白**时才视为行内注释。
- `none`：不做行内注释截断。

### 校验

| 设置项                                  | 默认值  | 描述 |
| --------------------------------------- | ------- | ---- |
| `ini.validation.checkDuplicateSections` | `true`  | 检查重复节 |
| `ini.validation.checkDuplicateKeys`     | `true`  | 检查重复键 |
| `ini.validation.checkEmptySections`     | `false` | 检查空节 |

## 推荐配置

保留 `:` 分隔符，并使用更智能的行内注释解析：

```json
{
  "ini.format.preserveDelimiters": true,
  "ini.parse.inlineCommentMode": "smart"
}
```

强制格式化输出为 `:` 分隔符：

```json
{
  "ini.format.delimiter": ":",
  "ini.format.preserveDelimiters": false
}
```
