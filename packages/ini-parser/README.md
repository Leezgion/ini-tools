[English](#english) | [中文](#chinese)

<a id="english"></a>

# @leezgion/ini-parser

A robust, type-safe INI file parser and formatter for TypeScript/JavaScript.

## Features

- **Parse**: Convert INI strings to JavaScript objects.
- **Format**: Convert objects back to INI strings with customizable formatting.
- **AST**: Access the Abstract Syntax Tree for advanced manipulation.
- **Validation**: Detect duplicate keys and sections.
- **Type Safety**: Written in TypeScript with full type definitions.

## Installation

```bash
npm install @leezgion/ini-parser
# or
pnpm add @leezgion/ini-parser
```

## Usage

### Parsing

```typescript
import { parse } from '@leezgion/ini-parser';

const iniContent = `
[database]
host = localhost
port = 5432
`;

const config = parse(iniContent);
console.log(config.database.host); // 'localhost'
```

### Formatting

```typescript
import { format } from '@leezgion/ini-parser';

const data = {
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
};

const iniString = format(data, {
  alignValues: true,
  insertSpaces: true,
});
```

---

<a id="chinese"></a>

# @leezgion/ini-parser

一个用于 TypeScript/JavaScript 的健壮、类型安全的 INI 文件解析器和格式化器。

## 功能特性

- **解析**：将 INI 字符串转换为 JavaScript 对象。
- **格式化**：将对象转换回 INI 字符串，支持自定义格式。
- **AST**：访问抽象语法树以进行高级操作。
- **校验**：检测重复的键和节。
- **类型安全**：使用 TypeScript 编写，提供完整的类型定义。

## 安装

```bash
npm install @leezgion/ini-parser
# 或
pnpm add @leezgion/ini-parser
```

## 使用方法

### 解析 (Parsing)

```typescript
import { parse } from '@leezgion/ini-parser';

const iniContent = `
[database]
host = localhost
port = 5432
`;

const config = parse(iniContent);
console.log(config.database.host); // 'localhost'
```

### 格式化 (Formatting)

```typescript
import { format } from '@leezgion/ini-parser';

const data = {
  server: {
    host: '0.0.0.0',
    port: 8080,
  },
};

const iniString = format(data, {
  alignValues: true,
  insertSpaces: true,
});
```
