/**
 * Position in the source text
 */
export interface Position {
  line: number;
  character: number;
}

/**
 * Range in the source text
 */
export interface Range {
  start: Position;
  end: Position;
}

/**
 * Base node interface
 */
export interface BaseNode {
  range: Range;
}

/**
 * Comment node (lines starting with ; or #)
 */
export interface CommentNode extends BaseNode {
  type: 'comment';
  text: string;
  marker: ';' | '#';
}

/**
 * Section header node [SectionName]
 */
export interface SectionNode extends BaseNode {
  type: 'section';
  name: string;
  properties: PropertyNode[];
  comments: CommentNode[];
}

/**
 * Property node (key = value)
 */
export interface PropertyNode extends BaseNode {
  type: 'property';
  key: string;
  value: string;
  delimiter: '=' | ':';
  keyRange: Range;
  valueRange: Range;
}

/**
 * Root document node
 */
export interface IniDocument extends BaseNode {
  type: 'document';
  /**
   * Global properties (before any section)
   */
  globalProperties: PropertyNode[];
  /**
   * All sections
   */
  sections: SectionNode[];
  /**
   * Top-level comments (before any section)
   */
  comments: CommentNode[];
}

/**
 * Diagnostic severity
 */
export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4,
}

/**
 * Diagnostic message
 */
export interface Diagnostic {
  range: Range;
  message: string;
  severity: DiagnosticSeverity;
  code?: string;
}

/**
 * Format options
 */
export interface FormatOptions {
  /**
   * Insert spaces around delimiter (=)
   * @default true
   */
  insertSpaces?: boolean;

  /**
   * Align all values to the same column
   * @default false
   */
  alignValues?: boolean;

  /**
   * Number of blank lines between sections
   * @default 1
   */
  sectionSpacing?: number;

  /**
   * Sort sections alphabetically
   * @default false
   */
  sortSections?: boolean;

  /**
   * Sort keys within sections alphabetically
   * @default false
   */
  sortKeys?: boolean;

  /**
   * Preferred delimiter
   * @default '='
   */
  delimiter?: '=' | ':';

  /**
   * Preserve each property's original delimiter (from parsing) when formatting.
   * When enabled, the formatter prefers the delimiter found on each PropertyNode.
   *
   * @default false
   */
  preserveDelimiters?: boolean;
}

/**
 * Parse options
 */
export interface ParseOptions {
  /**
   * Allow duplicate section names
   * @default false
   */
  allowDuplicateSections?: boolean;

  /**
   * Allow duplicate keys within a section
   * @default false
   */
  allowDuplicateKeys?: boolean;

  /**
   * Comment markers to recognize
   * @default [';', '#']
   */
  commentMarkers?: string[];

  /**
   * Key-value delimiters to recognize
   * @default ['=', ':']
   */
  delimiters?: string[];

  /**
   * How to treat inline comments that appear after a value.
   *
   * - 'legacy': strip everything after the first ';' or '#' occurrence (current behavior).
   * - 'smart': strip only when the marker appears outside quotes, and is either at the start
   *   of the value or preceded by whitespace.
   * - 'none': do not strip inline comments.
   *
   * @default 'legacy'
   */
  inlineCommentMode?: 'legacy' | 'smart' | 'none';
}
