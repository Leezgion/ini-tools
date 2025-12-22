import { IniDocument, SectionNode, PropertyNode } from './types';

/**
 * Convert INI document to a plain JavaScript object
 */
export function toObject(
  doc: IniDocument
): Record<string, Record<string, string>> {
  const result: Record<string, Record<string, string>> = {};

  // Global properties go under empty string key or '__global__'
  if (doc.globalProperties.length > 0) {
    result[''] = {};
    for (const prop of doc.globalProperties) {
      result[''][prop.key] = prop.value;
    }
  }

  // Each section becomes a nested object
  for (const section of doc.sections) {
    result[section.name] = {};
    for (const prop of section.properties) {
      result[section.name][prop.key] = prop.value;
    }
  }

  return result;
}

/**
 * Convert INI document to JSON string
 */
export function toJSON(doc: IniDocument, pretty = true): string {
  const obj = toObject(doc);
  return pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
}

/**
 * Create an INI document from a plain JavaScript object
 */
export function fromObject(
  obj: Record<string, Record<string, string> | string>
): IniDocument {
  const doc: IniDocument = {
    type: 'document',
    globalProperties: [],
    sections: [],
    comments: [],
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
  };

  let lineIndex = 0;

  for (const [sectionName, sectionContent] of Object.entries(obj)) {
    // Handle flat values at root level as global properties
    if (typeof sectionContent === 'string') {
      const property: PropertyNode = {
        type: 'property',
        key: sectionName,
        value: sectionContent,
        delimiter: '=',
        keyRange: {
          start: { line: lineIndex, character: 0 },
          end: { line: lineIndex, character: sectionName.length },
        },
        valueRange: {
          start: { line: lineIndex, character: sectionName.length + 3 },
          end: {
            line: lineIndex,
            character: sectionName.length + 3 + sectionContent.length,
          },
        },
        range: {
          start: { line: lineIndex, character: 0 },
          end: {
            line: lineIndex,
            character: sectionName.length + 3 + sectionContent.length,
          },
        },
      };
      doc.globalProperties.push(property);
      lineIndex++;
      continue;
    }

    // Handle global properties (empty section name)
    if (sectionName === '' || sectionName === '__global__') {
      for (const [key, value] of Object.entries(sectionContent)) {
        const property: PropertyNode = {
          type: 'property',
          key,
          value,
          delimiter: '=',
          keyRange: {
            start: { line: lineIndex, character: 0 },
            end: { line: lineIndex, character: key.length },
          },
          valueRange: {
            start: { line: lineIndex, character: key.length + 3 },
            end: { line: lineIndex, character: key.length + 3 + value.length },
          },
          range: {
            start: { line: lineIndex, character: 0 },
            end: { line: lineIndex, character: key.length + 3 + value.length },
          },
        };
        doc.globalProperties.push(property);
        lineIndex++;
      }
      continue;
    }

    // Create section
    const section: SectionNode = {
      type: 'section',
      name: sectionName,
      properties: [],
      comments: [],
      range: {
        start: { line: lineIndex, character: 0 },
        end: { line: lineIndex, character: sectionName.length + 2 },
      },
    };
    lineIndex++;

    // Add properties to section
    for (const [key, value] of Object.entries(sectionContent)) {
      const property: PropertyNode = {
        type: 'property',
        key,
        value,
        delimiter: '=',
        keyRange: {
          start: { line: lineIndex, character: 0 },
          end: { line: lineIndex, character: key.length },
        },
        valueRange: {
          start: { line: lineIndex, character: key.length + 3 },
          end: { line: lineIndex, character: key.length + 3 + value.length },
        },
        range: {
          start: { line: lineIndex, character: 0 },
          end: { line: lineIndex, character: key.length + 3 + value.length },
        },
      };
      section.properties.push(property);
      lineIndex++;
    }

    section.range.end = { line: lineIndex - 1, character: 0 };
    doc.sections.push(section);
  }

  doc.range.end = { line: lineIndex - 1, character: 0 };
  return doc;
}

/**
 * Create an INI document from a JSON string
 */
export function fromJSON(json: string): IniDocument {
  const obj = JSON.parse(json);
  return fromObject(obj);
}
