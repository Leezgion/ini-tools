import { IniDocument, FormatOptions } from './types';

const DEFAULT_FORMAT_OPTIONS: Required<FormatOptions> = {
  insertSpaces: true,
  alignValues: false,
  sectionSpacing: 1,
  sortSections: false,
  sortKeys: false,
  delimiter: '=',
};

/**
 * Format an INI document back to string
 */
export function format(doc: IniDocument, options?: FormatOptions): string {
  const opts = { ...DEFAULT_FORMAT_OPTIONS, ...options };
  const lines: string[] = [];

  // Helper to format a property line
  const formatProperty = (
    key: string,
    value: string,
    maxKeyLength?: number
  ): string => {
    const delimiter = opts.delimiter;
    if (opts.insertSpaces) {
      if (opts.alignValues && maxKeyLength) {
        const padding = ' '.repeat(maxKeyLength - key.length);
        return `${key}${padding} ${delimiter} ${value}`;
      }
      return `${key} ${delimiter} ${value}`;
    }
    return `${key}${delimiter}${value}`;
  };

  // Format global comments
  for (const comment of doc.comments) {
    lines.push(`${comment.marker} ${comment.text}`);
  }

  // Format global properties
  if (doc.globalProperties.length > 0) {
    const maxKeyLength = opts.alignValues
      ? Math.max(...doc.globalProperties.map((p) => p.key.length))
      : undefined;

    let properties = [...doc.globalProperties];
    if (opts.sortKeys) {
      properties = properties.sort((a, b) => a.key.localeCompare(b.key));
    }

    for (const prop of properties) {
      lines.push(formatProperty(prop.key, prop.value, maxKeyLength));
    }
  }

  // Add spacing before sections if there's global content
  if (lines.length > 0 && doc.sections.length > 0) {
    for (let i = 0; i < opts.sectionSpacing; i++) {
      lines.push('');
    }
  }

  // Format sections
  let sections = [...doc.sections];
  if (opts.sortSections) {
    sections = sections.sort((a, b) => a.name.localeCompare(b.name));
  }

  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];

    // Section header
    lines.push(`[${section.name}]`);

    // Section comments
    for (const comment of section.comments) {
      lines.push(`${comment.marker} ${comment.text}`);
    }

    // Section properties
    const maxKeyLength = opts.alignValues
      ? Math.max(...section.properties.map((p) => p.key.length), 0)
      : undefined;

    let properties = [...section.properties];
    if (opts.sortKeys) {
      properties = properties.sort((a, b) => a.key.localeCompare(b.key));
    }

    for (const prop of properties) {
      lines.push(formatProperty(prop.key, prop.value, maxKeyLength));
    }

    // Add spacing between sections
    if (sectionIndex < sections.length - 1) {
      for (let i = 0; i < opts.sectionSpacing; i++) {
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

/**
 * Stringify an INI document (alias for format with default options)
 */
export function stringify(doc: IniDocument): string {
  return format(doc);
}
