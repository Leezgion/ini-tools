import {
  IniDocument,
  SectionNode,
  PropertyNode,
  CommentNode,
  Position,
  Range,
  ParseOptions,
} from './types';

const DEFAULT_OPTIONS: Required<ParseOptions> = {
  allowDuplicateSections: false,
  allowDuplicateKeys: false,
  commentMarkers: [';', '#'],
  delimiters: ['=', ':'],
  inlineCommentMode: 'legacy',
};

function stripInlineCommentLegacy(
  value: string,
  commentMarkers: string[]
): string {
  let cleanValue = value;
  for (const marker of commentMarkers) {
    const commentIndex = cleanValue.indexOf(marker);
    if (commentIndex !== -1) {
      cleanValue = cleanValue.substring(0, commentIndex).trim();
    }
  }
  return cleanValue;
}

function stripInlineCommentSmart(
  value: string,
  commentMarkers: string[]
): string {
  let inSingle = false;
  let inDouble = false;
  let escaped = false;

  for (let i = 0; i < value.length; i++) {
    const ch = value[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      escaped = true;
      continue;
    }

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }

    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }

    if (!inSingle && !inDouble && commentMarkers.includes(ch)) {
      const prev = i > 0 ? value[i - 1] : '';
      const precededByWhitespace = i === 0 || /\s/.test(prev);
      if (precededByWhitespace) {
        return value.substring(0, i).trim();
      }
    }
  }

  return value;
}

/**
 * Create a position object
 */
function createPosition(line: number, character: number): Position {
  return { line, character };
}

/**
 * Create a range object
 */
function createRange(
  startLine: number,
  startChar: number,
  endLine: number,
  endChar: number
): Range {
  return {
    start: createPosition(startLine, startChar),
    end: createPosition(endLine, endChar),
  };
}

/**
 * Parse INI content into an AST
 */
export function parse(text: string, options?: ParseOptions): IniDocument {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const lines = text.split(/\r?\n/);

  const document: IniDocument = {
    type: 'document',
    globalProperties: [],
    sections: [],
    comments: [],
    range: createRange(
      0,
      0,
      lines.length - 1,
      lines[lines.length - 1]?.length || 0
    ),
  };

  let currentSection: SectionNode | null = null;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine === '') {
      continue;
    }

    // Check for comment
    const commentMarker = opts.commentMarkers.find((m) =>
      trimmedLine.startsWith(m)
    );
    if (commentMarker) {
      const comment: CommentNode = {
        type: 'comment',
        text: trimmedLine.substring(commentMarker.length).trim(),
        marker: commentMarker as ';' | '#',
        range: createRange(lineIndex, 0, lineIndex, line.length),
      };

      if (currentSection) {
        currentSection.comments.push(comment);
      } else {
        document.comments.push(comment);
      }
      continue;
    }

    // Check for section header
    if (trimmedLine.startsWith('[')) {
      const endBracket = trimmedLine.indexOf(']');
      if (endBracket !== -1) {
        const sectionName = trimmedLine.substring(1, endBracket).trim();
        currentSection = {
          type: 'section',
          name: sectionName,
          properties: [],
          comments: [],
          range: createRange(lineIndex, 0, lineIndex, line.length),
        };
        document.sections.push(currentSection);
        continue;
      }
    }

    // Check for property (key = value)
    for (const delimiter of opts.delimiters) {
      const delimiterIndex = line.indexOf(delimiter);
      if (delimiterIndex !== -1) {
        const key = line.substring(0, delimiterIndex).trim();
        const value = line.substring(delimiterIndex + 1).trim();

        // Remove inline comments from value
        let cleanValue = value;
        if (opts.inlineCommentMode === 'legacy') {
          cleanValue = stripInlineCommentLegacy(value, opts.commentMarkers);
        } else if (opts.inlineCommentMode === 'smart') {
          cleanValue = stripInlineCommentSmart(value, opts.commentMarkers);
        }

        const property: PropertyNode = {
          type: 'property',
          key,
          value: cleanValue,
          delimiter: delimiter as '=' | ':',
          keyRange: createRange(
            lineIndex,
            line.indexOf(key),
            lineIndex,
            line.indexOf(key) + key.length
          ),
          valueRange: createRange(
            lineIndex,
            delimiterIndex +
              1 +
              (line.substring(delimiterIndex + 1).length -
                line.substring(delimiterIndex + 1).trimStart().length),
            lineIndex,
            line.length
          ),
          range: createRange(lineIndex, 0, lineIndex, line.length),
        };

        if (currentSection) {
          currentSection.properties.push(property);
        } else {
          document.globalProperties.push(property);
        }
        break;
      }
    }
  }

  // Update section ranges to include all their content
  for (let i = 0; i < document.sections.length; i++) {
    const section = document.sections[i];
    const nextSection = document.sections[i + 1];

    const lastProperty = section.properties[section.properties.length - 1];
    const lastComment = section.comments[section.comments.length - 1];

    let endLine = section.range.start.line;

    if (lastProperty) {
      endLine = Math.max(endLine, lastProperty.range.end.line);
    }
    if (lastComment) {
      endLine = Math.max(endLine, lastComment.range.end.line);
    }

    if (nextSection) {
      endLine = Math.min(endLine, nextSection.range.start.line - 1);
    } else {
      endLine = lines.length - 1;
    }

    section.range = createRange(
      section.range.start.line,
      0,
      endLine,
      lines[endLine]?.length || 0
    );
  }

  return document;
}

/**
 * Get section by name
 */
export function getSection(
  doc: IniDocument,
  name: string
): SectionNode | undefined {
  return doc.sections.find((s) => s.name.toLowerCase() === name.toLowerCase());
}

/**
 * Get property value
 */
export function getValue(
  doc: IniDocument,
  section: string,
  key: string
): string | undefined {
  const sectionNode = getSection(doc, section);
  if (!sectionNode) return undefined;

  const property = sectionNode.properties.find(
    (p) => p.key.toLowerCase() === key.toLowerCase()
  );
  return property?.value;
}

/**
 * Get all section names
 */
export function getSectionNames(doc: IniDocument): string[] {
  return doc.sections.map((s) => s.name);
}

/**
 * Get all keys in a section
 */
export function getKeys(doc: IniDocument, section: string): string[] {
  const sectionNode = getSection(doc, section);
  if (!sectionNode) return [];
  return sectionNode.properties.map((p) => p.key);
}
