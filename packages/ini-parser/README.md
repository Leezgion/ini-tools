[English](#english) | [中文](#chinese)

<a id="english"></a>

# @leezgion/ini-parser

A robust, type-safe INI parser/formatter for TypeScript/JavaScript.

This package parses INI text into an AST (`IniDocument`) with source ranges, which can then be formatted, validated, or converted to JSON.

## Features

- **Parse (AST)**: Parse INI text into a typed AST with ranges.
- **Format**: Format an `IniDocument` back to INI text.
- **Validation**: Detect duplicate sections/keys and optional empty sections.
- **Conversion**: `toJSON()` / `fromJSON()` helpers.

## Installation

```bash
npm install @leezgion/ini-parser
# or
pnpm add @leezgion/ini-parser
```

## Usage

### Parse

```ts
import { parse } from '@leezgion/ini-parser';

const iniText = `
[database]
host = localhost
port = 5432
`;

const doc = parse(iniText, {
  // 'legacy' | 'smart' | 'none'
  inlineCommentMode: 'smart',
});

console.log(doc.sections[0].name); // database
```

### Format

```ts
import { parse, format } from '@leezgion/ini-parser';

const doc = parse('[s]\na: 1\nb = 2');

const out = format(doc, {
  insertSpaces: true,
  alignValues: true,
  // Prefer each property's original delimiter (':' vs '=')
  preserveDelimiters: true,
  // Used when preserveDelimiters=false
  delimiter: '=',
});

console.log(out);
```

### Validate

```ts
import { parse, validate } from '@leezgion/ini-parser';

const doc = parse('[s]\nkey=1\nkey=2');

const diagnostics = validate(doc, {
  checkDuplicateKeys: true,
  checkDuplicateSections: true,
  checkEmptySections: false,
});

console.log(diagnostics.map((d) => d.code));
```

### Convert to JSON

```ts
import { parse, toJSON } from '@leezgion/ini-parser';

const doc = parse('[db]\nhost=localhost');
const json = toJSON(doc);
console.log(json);
```

## Options

### ParseOptions

- `inlineCommentMode`: `'legacy' | 'smart' | 'none'`
  - `legacy`: strips text after the first `;` or `#` in the value.
  - `smart`: strips only when the marker is outside quotes and preceded by whitespace.
  - `none`: disables inline comment stripping.

### FormatOptions

- `preserveDelimiters` (boolean): preserve each property's original delimiter when formatting.
- `delimiter` (`'=' | ':'`): preferred delimiter when not preserving.
- `insertSpaces`, `alignValues`, `sectionSpacing`, `sortSections`, `sortKeys`.

---

<a id="chinese"></a>

# @leezgion/ini-parser

一个用于 TypeScript/JavaScript 的健壮、类型安全的 INI 解析/格式化库。

本库会将 INI 文本解析为包含位置信息（range）的 AST（`IniDocument`），并在此基础上提供格式化、校验与 JSON 转换能力。

## 功能特性

- **解析（AST）**：将 INI 文本解析为带 range 的类型化 AST。
- **格式化**：将 `IniDocument` 格式化回 INI 文本。
- **校验**：检测重复节/重复键，并支持可选的空节检测。
- **转换**：提供 `toJSON()` / `fromJSON()` 辅助方法。

## 安装

```bash
npm install @leezgion/ini-parser
# 或
pnpm add @leezgion/ini-parser
```

## 使用方法

### 解析

```ts
import { parse } from '@leezgion/ini-parser';

const iniText = `
[database]
host = localhost
port = 5432
`;

const doc = parse(iniText, {
  // 'legacy' | 'smart' | 'none'
  inlineCommentMode: 'smart',
});

console.log(doc.sections[0].name); // database
```

### 格式化

```ts
import { parse, format } from '@leezgion/ini-parser';

const doc = parse('[s]\na: 1\nb = 2');

const out = format(doc, {
  insertSpaces: true,
  alignValues: true,
  // 优先保留每条属性原始分隔符（':' / '='）
  preserveDelimiters: true,
  // preserveDelimiters=false 时使用
  delimiter: '=',
});

console.log(out);
```

### 校验

```ts
import { parse, validate } from '@leezgion/ini-parser';

const doc = parse('[s]\nkey=1\nkey=2');

const diagnostics = validate(doc, {
  checkDuplicateKeys: true,
  checkDuplicateSections: true,
  checkEmptySections: false,
});

console.log(diagnostics.map((d) => d.code));
```

### 转换为 JSON

```ts
import { parse, toJSON } from '@leezgion/ini-parser';

const doc = parse('[db]\nhost=localhost');
const json = toJSON(doc);
console.log(json);
```

## 选项说明

### ParseOptions

- `inlineCommentMode`: `'legacy' | 'smart' | 'none'`
  - `legacy`：兼容旧行为，值中出现 `;` / `#` 后会被截断。
  - `smart`：引号感知，仅在非引号内且前面是空白时才作为行内注释。
  - `none`：不做行内注释截断。

### FormatOptions

- `preserveDelimiters`：格式化时保留每条属性原始分隔符。
- `delimiter`：当不保留原始分隔符时使用的首选分隔符。
- `insertSpaces`、`alignValues`、`sectionSpacing`、`sortSections`、`sortKeys`。
