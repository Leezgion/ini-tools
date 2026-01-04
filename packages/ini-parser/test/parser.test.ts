import { describe, it, expect } from 'vitest';
import { parse, format, validate, toJSON, fromJSON } from '../src';

describe('INI Parser', () => {
  describe('parse', () => {
    it('should parse empty content', () => {
      const doc = parse('');
      expect(doc.sections).toHaveLength(0);
      expect(doc.globalProperties).toHaveLength(0);
    });

    it('should parse sections', () => {
      const content = `[Section1]
key1 = value1

[Section2]
key2 = value2`;

      const doc = parse(content);
      expect(doc.sections).toHaveLength(2);
      expect(doc.sections[0].name).toBe('Section1');
      expect(doc.sections[1].name).toBe('Section2');
    });

    it('should parse properties', () => {
      const content = `[Database]
host = localhost
port = 3306`;

      const doc = parse(content);
      expect(doc.sections[0].properties).toHaveLength(2);
      expect(doc.sections[0].properties[0].key).toBe('host');
      expect(doc.sections[0].properties[0].value).toBe('localhost');
      expect(doc.sections[0].properties[1].key).toBe('port');
      expect(doc.sections[0].properties[1].value).toBe('3306');
    });

    it('should parse comments', () => {
      const content = `; This is a comment
# This is also a comment
[Section]
key = value`;

      const doc = parse(content);
      expect(doc.comments).toHaveLength(2);
      expect(doc.comments[0].text).toBe('This is a comment');
      expect(doc.comments[0].marker).toBe(';');
      expect(doc.comments[1].marker).toBe('#');
    });

    it('should parse global properties', () => {
      const content = `globalKey = globalValue

[Section]
key = value`;

      const doc = parse(content);
      expect(doc.globalProperties).toHaveLength(1);
      expect(doc.globalProperties[0].key).toBe('globalKey');
      expect(doc.globalProperties[0].value).toBe('globalValue');
    });

    it('should handle colon delimiter', () => {
      const content = `[Section]
key: value`;

      const doc = parse(content);
      expect(doc.sections[0].properties[0].delimiter).toBe(':');
      expect(doc.sections[0].properties[0].value).toBe('value');
    });

    it('should strip inline comments in legacy mode (default)', () => {
      const content = `[Section]
url = http://example.com/a#frag ; trailing`;

      const doc = parse(content);
      // legacy behavior strips at the first marker occurrence
      expect(doc.sections[0].properties[0].value).toBe('http://example.com/a');
    });

    it('should keep # and ; inside quotes in smart mode', () => {
      const content = `[Section]
password = "a#b" ; comment
note = 'x;y' # comment`;

      const doc = parse(content, { inlineCommentMode: 'smart' });
      expect(doc.sections[0].properties[0].value).toBe('"a#b"');
      expect(doc.sections[0].properties[1].value).toBe("'x;y'");
    });

    it('should not strip URL fragments in smart mode', () => {
      const content = `[Section]
url = http://example.com/a#frag`;

      const doc = parse(content, { inlineCommentMode: 'smart' });
      expect(doc.sections[0].properties[0].value).toBe(
        'http://example.com/a#frag'
      );
    });

    it('should not strip anything in none mode', () => {
      const content = `[Section]
value = abc ; still part of value`;

      const doc = parse(content, { inlineCommentMode: 'none' });
      expect(doc.sections[0].properties[0].value).toBe(
        'abc ; still part of value'
      );
    });
  });

  describe('format', () => {
    it('should format with default options', () => {
      const content = `[Section]
key=value`;

      const doc = parse(content);
      const formatted = format(doc);
      expect(formatted).toBe(`[Section]
key = value`);
    });

    it('should align values when option is set', () => {
      const content = `[Section]
a = 1
longkey = 2`;

      const doc = parse(content);
      const formatted = format(doc, { alignValues: true });
      expect(formatted).toContain('a       = 1');
      expect(formatted).toContain('longkey = 2');
    });

    it('should sort sections when option is set', () => {
      const content = `[Zebra]
key = 1

[Apple]
key = 2`;

      const doc = parse(content);
      const formatted = format(doc, { sortSections: true });
      expect(formatted.indexOf('[Apple]')).toBeLessThan(
        formatted.indexOf('[Zebra]')
      );
    });

    it('should sort keys when option is set', () => {
      const content = `[Section]
zebra = 1
apple = 2`;

      const doc = parse(content);
      const formatted = format(doc, { sortKeys: true });
      expect(formatted.indexOf('apple')).toBeLessThan(
        formatted.indexOf('zebra')
      );
    });

    it('should preserve property delimiters when option is set', () => {
      const content = `[Section]
      a: 1
      b = 2`;

      const doc = parse(content);
      const formatted = format(doc, {
        preserveDelimiters: true,
        delimiter: '=',
        insertSpaces: true,
      });

      expect(formatted).toContain('a : 1');
      expect(formatted).toContain('b = 2');
    });

    it('should not preserve delimiters by default', () => {
      const content = `[Section]
      a: 1`;

      const doc = parse(content);
      const formatted = format(doc);
      expect(formatted).toContain('a = 1');
    });
  });

  describe('validate', () => {
    it('should detect duplicate sections', () => {
      const content = `[Section]
key1 = value1

[Section]
key2 = value2`;

      const doc = parse(content);
      const diagnostics = validate(doc);
      expect(diagnostics.some((d) => d.code === 'duplicate-section')).toBe(
        true
      );
    });

    it('should detect duplicate keys', () => {
      const content = `[Section]
key = value1
key = value2`;

      const doc = parse(content);
      const diagnostics = validate(doc);
      expect(diagnostics.some((d) => d.code === 'duplicate-key')).toBe(true);
    });

    it('should detect empty sections when option is set', () => {
      const content = `[EmptySection]

[Section]
key = value`;

      const doc = parse(content);
      const diagnostics = validate(doc, { checkEmptySections: true });
      expect(diagnostics.some((d) => d.code === 'empty-section')).toBe(true);
    });
  });

  describe('converter', () => {
    it('should convert to JSON', () => {
      const content = `[Database]
host = localhost
port = 3306`;

      const doc = parse(content);
      const json = toJSON(doc);
      const obj = JSON.parse(json);

      expect(obj.Database.host).toBe('localhost');
      expect(obj.Database.port).toBe('3306');
    });

    it('should convert from JSON', () => {
      const json = JSON.stringify({
        Database: {
          host: 'localhost',
          port: '3306',
        },
      });

      const doc = fromJSON(json);
      expect(doc.sections).toHaveLength(1);
      expect(doc.sections[0].name).toBe('Database');
      expect(doc.sections[0].properties).toHaveLength(2);
    });
  });
});
