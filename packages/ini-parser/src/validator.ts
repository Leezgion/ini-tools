import { IniDocument, Diagnostic, DiagnosticSeverity } from './types';

/**
 * Validate options
 */
export interface ValidateOptions {
  /**
   * Check for duplicate section names
   * @default true
   */
  checkDuplicateSections?: boolean;

  /**
   * Check for duplicate keys within sections
   * @default true
   */
  checkDuplicateKeys?: boolean;

  /**
   * Check for empty sections
   * @default false
   */
  checkEmptySections?: boolean;

  /**
   * Check for empty values
   * @default false
   */
  checkEmptyValues?: boolean;
}

const DEFAULT_VALIDATE_OPTIONS: Required<ValidateOptions> = {
  checkDuplicateSections: true,
  checkDuplicateKeys: true,
  checkEmptySections: false,
  checkEmptyValues: false,
};

/**
 * Validate an INI document and return diagnostics
 */
export function validate(
  doc: IniDocument,
  options?: ValidateOptions
): Diagnostic[] {
  const opts = { ...DEFAULT_VALIDATE_OPTIONS, ...options };
  const diagnostics: Diagnostic[] = [];

  // Check for duplicate sections
  if (opts.checkDuplicateSections) {
    const sectionNames = new Map<string, number>();

    for (const section of doc.sections) {
      const lowerName = section.name.toLowerCase();
      const existingLine = sectionNames.get(lowerName);

      if (existingLine !== undefined) {
        diagnostics.push({
          range: section.range,
          message: `Duplicate section "${section.name}" (first defined at line ${existingLine + 1})`,
          severity: DiagnosticSeverity.Warning,
          code: 'duplicate-section',
        });
      } else {
        sectionNames.set(lowerName, section.range.start.line);
      }
    }
  }

  // Check for duplicate keys within sections
  if (opts.checkDuplicateKeys) {
    // Check global properties
    const globalKeys = new Map<string, number>();
    for (const prop of doc.globalProperties) {
      const lowerKey = prop.key.toLowerCase();
      const existingLine = globalKeys.get(lowerKey);

      if (existingLine !== undefined) {
        diagnostics.push({
          range: prop.keyRange,
          message: `Duplicate key "${prop.key}" (first defined at line ${existingLine + 1})`,
          severity: DiagnosticSeverity.Warning,
          code: 'duplicate-key',
        });
      } else {
        globalKeys.set(lowerKey, prop.range.start.line);
      }
    }

    // Check each section
    for (const section of doc.sections) {
      const keyMap = new Map<string, number>();

      for (const prop of section.properties) {
        const lowerKey = prop.key.toLowerCase();
        const existingLine = keyMap.get(lowerKey);

        if (existingLine !== undefined) {
          diagnostics.push({
            range: prop.keyRange,
            message: `Duplicate key "${prop.key}" in section [${section.name}] (first defined at line ${existingLine + 1})`,
            severity: DiagnosticSeverity.Warning,
            code: 'duplicate-key',
          });
        } else {
          keyMap.set(lowerKey, prop.range.start.line);
        }
      }
    }
  }

  // Check for empty sections
  if (opts.checkEmptySections) {
    for (const section of doc.sections) {
      if (section.properties.length === 0) {
        diagnostics.push({
          range: section.range,
          message: `Section [${section.name}] is empty`,
          severity: DiagnosticSeverity.Information,
          code: 'empty-section',
        });
      }
    }
  }

  // Check for empty values
  if (opts.checkEmptyValues) {
    for (const prop of doc.globalProperties) {
      if (prop.value === '') {
        diagnostics.push({
          range: prop.valueRange,
          message: `Property "${prop.key}" has an empty value`,
          severity: DiagnosticSeverity.Hint,
          code: 'empty-value',
        });
      }
    }

    for (const section of doc.sections) {
      for (const prop of section.properties) {
        if (prop.value === '') {
          diagnostics.push({
            range: prop.valueRange,
            message: `Property "${prop.key}" has an empty value`,
            severity: DiagnosticSeverity.Hint,
            code: 'empty-value',
          });
        }
      }
    }
  }

  // Sort diagnostics by line number
  diagnostics.sort((a, b) => a.range.start.line - b.range.start.line);

  return diagnostics;
}
