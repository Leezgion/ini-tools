[English](#english) | [中文](#chinese)

<a id="english"></a>

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-22

### Added

#### VS Code Extension (vscode-ini)

- **Syntax Highlighting**: Full TextMate grammar support for INI files.
  - Sections, keys, values, comments (`;` and `#`).
  - Support for `=` and `:` delimiters.
  - Quoted strings, numbers, booleans.
- **Code Folding**: Fold/unfold sections for better navigation.
- **Outline View**: Document symbols showing sections and properties hierarchy.
- **Code Snippets**: Quick templates for common configurations (Database, Server, Log, etc.).
- **Formatting**: Auto-format INI documents.
  - Configurable space around delimiters.
  - Value alignment option.
  - Section spacing control.
  - **Sorting**: Options to sort sections and keys alphabetically.
- **Validation**: Real-time diagnostics.
  - Duplicate section detection.
  - Duplicate key detection.
  - Empty section warnings (optional).
- **Commands**:
  - `INI: Format INI Document`
  - `INI: Convert INI to JSON`
  - `INI: Sort Sections Alphabetically`
  - `INI: Sort Keys Alphabetically`
- **File Associations**: `.ini`, `.cfg`, `.conf`, `.desktop`, `.properties`, `.editorconfig`, `php.ini`, `my.cnf`.

#### INI Parser Library (@leezgion/ini-parser)

- `parse()` - Parse INI content to AST.
- `format()` - Format INI document with options.
- `validate()` - Validate and detect issues.
- `toJSON()` / `fromJSON()` - JSON conversion utilities.

---

<a id="chinese"></a>

# 更新日志

本项目的所有重要更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵守 [语义化版本](https://semver.org/lang/zh-CN/spec/v2.0.0.html)。

## [0.1.0] - 2025-12-22

### 新增

#### VS Code 插件 (vscode-ini)

- **语法高亮**：完整的 INI 文件 TextMate 语法支持。
  - 支持节（Section）、键、值、注释（`;` 和 `#`）。
  - 支持 `=` 和 `:` 分隔符。
  - 支持引号字符串、数字、布尔值。
- **代码折叠**：支持折叠/展开节，方便导航。
- **大纲视图**：显示节和属性层级结构的文档符号。
- **代码片段**：常用配置的快速模板（数据库、服务器、日志等）。
- **代码格式化**：自动格式化 INI 文档。
  - 可配置分隔符周围的空格。
  - 值对齐选项。
  - 节间距控制。
  - **排序**：支持按字母顺序对节和键进行排序的选项。
- **代码校验**：实时诊断。
  - 重复节检测。
  - 重复键检测。
  - 空节警告（可选）。
- **命令**：
  - `INI: Format INI Document` (格式化文档)
  - `INI: Convert INI to JSON` (转换为 JSON)
  - `INI: Sort Sections Alphabetically` (按字母顺序排序节)
  - `INI: Sort Keys Alphabetically` (按字母顺序排序键)
- **文件关联**：`.ini`, `.cfg`, `.conf`, `.desktop`, `.properties`, `.editorconfig`, `php.ini`, `my.cnf`。

#### INI 解析库 (@leezgion/ini-parser)

- `parse()` - 将 INI 内容解析为 AST。
- `format()` - 带选项格式化 INI 文档。
- `validate()` - 校验并检测问题。
- `toJSON()` / `fromJSON()` - JSON 转换工具。
