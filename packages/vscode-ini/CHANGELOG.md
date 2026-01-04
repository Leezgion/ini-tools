[English](#english) | [中文](#chinese)

<a id="english"></a>

# Changelog

All notable changes to the "vscode-ini" extension will be documented in this file.

## [0.2.0] - 2026-01-04

### Added

- Quick Fix code actions for duplicate sections/keys:
  - Go to first definition
  - Rename duplicate (append `_2`, `_3`, ...)
  - Delete duplicate (safe delete)
- New formatting options:
  - `ini.format.delimiter`
  - `ini.format.preserveDelimiters`
- New parsing option:
  - `ini.parse.inlineCommentMode` (`legacy` | `smart` | `none`)
- New validation option:
  - `ini.validation.checkEmptySections`

### Fixed

- Unified formatting option handling so the format command and the formatting provider behave consistently.

## [0.1.0] - 2025-12-22

### Added

- Initial release of the extension.
- **Syntax Highlighting**: Support for standard INI format.
- **Formatting**: Custom formatter with sorting capabilities.
- **Validation**: Diagnostics for duplicate keys and sections.
- **Snippets**: Collection of useful INI snippets.
- **Commands**: JSON conversion and sorting commands.

---

<a id="chinese"></a>

# 更新日志

"vscode-ini" 插件的所有重要更改都将记录在此文件中。

## [0.2.0] - 2026-01-04

### 新增

- 为重复节/重复键提供 Quick Fix：
  - 跳转到首次定义
  - 自动重命名重复项（追加 `_2`、`_3`...）
  - 删除当前重复项（安全删除）
- 新增格式化选项：
  - `ini.format.delimiter`
  - `ini.format.preserveDelimiters`
- 新增解析选项：
  - `ini.parse.inlineCommentMode`（`legacy` | `smart` | `none`）
- 新增校验选项：
  - `ini.validation.checkEmptySections`

### 修复

- 统一格式化选项读取逻辑，使“格式化命令”和“格式化提供器”的行为保持一致。

## [0.1.0] - 2025-12-22

### 新增

- 插件首次发布。
- **语法高亮**：支持标准 INI 格式。
- **代码格式化**：带有排序功能的自定义格式化程序。
- **代码校验**：重复键和节的诊断。
- **代码片段**：实用的 INI 代码片段集合。
- **命令**：JSON 转换和排序命令。
