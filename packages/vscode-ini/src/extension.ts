import * as vscode from 'vscode';
import {
  parse,
  format,
  validate,
  toJSON,
  FormatOptions,
  ParseOptions,
  DiagnosticSeverity as IniDiagnosticSeverity,
} from '@leezgion/ini-parser';

let diagnosticCollection: vscode.DiagnosticCollection;

const COMMAND_GO_TO_FIRST_DEFINITION = 'ini._goToFirstDefinition';

/**
 * Activate the extension
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('INI Language Support is now active!');

  // Create diagnostic collection
  diagnosticCollection = vscode.languages.createDiagnosticCollection('ini');
  context.subscriptions.push(diagnosticCollection);

  // Register document symbol provider (Outline)
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: 'ini' },
      new IniDocumentSymbolProvider()
    )
  );

  // Register document formatting provider
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider(
      { language: 'ini' },
      new IniDocumentFormattingProvider()
    )
  );

  // Register folding range provider
  context.subscriptions.push(
    vscode.languages.registerFoldingRangeProvider(
      { language: 'ini' },
      new IniFoldingRangeProvider()
    )
  );

  // Register code actions (Quick Fix)
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      { language: 'ini' },
      new IniCodeActionProvider(),
      {
        providedCodeActionKinds: IniCodeActionProvider.providedCodeActionKinds,
      }
    )
  );

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('ini.format', formatDocument),
    vscode.commands.registerCommand('ini.convertToJson', convertToJson),
    vscode.commands.registerCommand('ini.sortSections', sortSections),
    vscode.commands.registerCommand('ini.sortKeys', sortKeys),
    vscode.commands.registerCommand(
      COMMAND_GO_TO_FIRST_DEFINITION,
      goToFirstDefinition
    )
  );

  // Register diagnostics on document change
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      if (e.document.languageId === 'ini') {
        updateDiagnostics(e.document);
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument((doc) => {
      if (doc.languageId === 'ini') {
        updateDiagnostics(doc);
      }
    })
  );

  // Initial diagnostics for open documents
  vscode.workspace.textDocuments.forEach((doc) => {
    if (doc.languageId === 'ini') {
      updateDiagnostics(doc);
    }
  });
}

/**
 * Deactivate the extension
 */
export function deactivate() {
  diagnosticCollection?.dispose();
}

class IniCodeActionProvider implements vscode.CodeActionProvider {
  static readonly providedCodeActionKinds = [vscode.CodeActionKind.QuickFix];

  provideCodeActions(
    document: vscode.TextDocument,
    _range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.ProviderResult<vscode.CodeAction[]> {
    const actions: vscode.CodeAction[] = [];

    const text = document.getText();
    const iniDoc = parse(text, getParseOptions());

    for (const diagnostic of context.diagnostics) {
      const code = getDiagnosticCodeString(diagnostic.code);
      if (code !== 'duplicate-key' && code !== 'duplicate-section') continue;

      if (code === 'duplicate-key') {
        const info = extractDuplicateKeyInfo(diagnostic.message);
        if (info) {
          const property = findPropertyNode(
            iniDoc,
            diagnostic.range.start.line,
            info.key,
            info.sectionName
          );

          if (property) {
            const keyRange = new vscode.Range(
              property.keyRange.start.line,
              property.keyRange.start.character,
              property.keyRange.end.line,
              property.keyRange.end.character
            );

            const newKey = generateUniqueKeyName(
              iniDoc,
              info.key,
              info.sectionName
            );

            const rename = new vscode.CodeAction(
              `Rename duplicate key to "${newKey}"`,
              vscode.CodeActionKind.QuickFix
            );
            rename.diagnostics = [diagnostic];
            rename.isPreferred = true;
            rename.edit = new vscode.WorkspaceEdit();
            rename.edit.replace(document.uri, keyRange, newKey);
            actions.push(rename);

            const deleteLine = new vscode.CodeAction(
              'Delete this duplicate key',
              vscode.CodeActionKind.QuickFix
            );
            deleteLine.diagnostics = [diagnostic];
            deleteLine.edit = new vscode.WorkspaceEdit();
            const lineRange = document.lineAt(
              property.range.start.line
            ).rangeIncludingLineBreak;
            deleteLine.edit.delete(document.uri, lineRange);
            actions.push(deleteLine);
          }
        }
      }

      if (code === 'duplicate-section') {
        const info = extractDuplicateSectionInfo(diagnostic.message);
        const section = findSectionNodeByLine(
          iniDoc,
          diagnostic.range.start.line
        );

        if (info && section) {
          const newName = generateUniqueSectionName(iniDoc, section.name);
          const headerLine = document.lineAt(section.range.start.line).text;
          const headerRange = getSectionNameRangeFromHeader(
            section.range.start.line,
            headerLine
          );

          if (headerRange) {
            const rename = new vscode.CodeAction(
              `Rename duplicate section to "${newName}"`,
              vscode.CodeActionKind.QuickFix
            );
            rename.diagnostics = [diagnostic];
            rename.isPreferred = true;
            rename.edit = new vscode.WorkspaceEdit();
            rename.edit.replace(document.uri, headerRange, newName);
            actions.push(rename);
          }

          const deleteSection = new vscode.CodeAction(
            'Delete this duplicate section',
            vscode.CodeActionKind.QuickFix
          );
          deleteSection.diagnostics = [diagnostic];
          deleteSection.edit = new vscode.WorkspaceEdit();
          const deleteRange = getSectionDeletionRange(document, section);
          if (deleteRange) {
            deleteSection.edit.delete(document.uri, deleteRange);
            actions.push(deleteSection);
          }
        }
      }

      const firstLine1Based = extractFirstDefinedLine(diagnostic.message);
      if (!firstLine1Based) continue;

      const targetLine0Based = Math.max(0, firstLine1Based - 1);
      const title =
        code === 'duplicate-section'
          ? 'Go to first section definition'
          : 'Go to first key definition';

      const action = new vscode.CodeAction(
        title,
        vscode.CodeActionKind.QuickFix
      );
      action.diagnostics = [diagnostic];
      action.isPreferred = true;
      action.command = {
        command: COMMAND_GO_TO_FIRST_DEFINITION,
        title,
        arguments: [document.uri, targetLine0Based],
      };

      actions.push(action);
    }

    return actions;
  }
}

/**
 * Document Symbol Provider for Outline view
 */
class IniDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  provideDocumentSymbols(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
    const text = document.getText();
    const doc = parse(text, getParseOptions());
    const symbols: vscode.DocumentSymbol[] = [];

    // Add global properties
    for (const prop of doc.globalProperties) {
      const range = new vscode.Range(
        prop.range.start.line,
        prop.range.start.character,
        prop.range.end.line,
        prop.range.end.character
      );
      const symbol = new vscode.DocumentSymbol(
        prop.key,
        prop.value,
        vscode.SymbolKind.Property,
        range,
        range
      );
      symbols.push(symbol);
    }

    // Add sections
    for (const section of doc.sections) {
      const sectionRange = new vscode.Range(
        section.range.start.line,
        section.range.start.character,
        section.range.end.line,
        section.range.end.character
      );
      const selectionRange = new vscode.Range(
        section.range.start.line,
        0,
        section.range.start.line,
        section.name.length + 2
      );

      const sectionSymbol = new vscode.DocumentSymbol(
        section.name,
        `${section.properties.length} properties`,
        vscode.SymbolKind.Namespace,
        sectionRange,
        selectionRange
      );

      // Add properties as children
      for (const prop of section.properties) {
        const propRange = new vscode.Range(
          prop.range.start.line,
          prop.range.start.character,
          prop.range.end.line,
          prop.range.end.character
        );
        const propSymbol = new vscode.DocumentSymbol(
          prop.key,
          prop.value,
          vscode.SymbolKind.Property,
          propRange,
          propRange
        );
        sectionSymbol.children.push(propSymbol);
      }

      symbols.push(sectionSymbol);
    }

    return symbols;
  }
}

/**
 * Document Formatting Provider
 */
class IniDocumentFormattingProvider
  implements vscode.DocumentFormattingEditProvider
{
  provideDocumentFormattingEdits(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.TextEdit[]> {
    const options = getFormatOptions();

    const text = document.getText();
    const doc = parse(text, getParseOptions());
    const formatted = format(doc, options);

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );

    return [vscode.TextEdit.replace(fullRange, formatted)];
  }
}

/**
 * Folding Range Provider
 */
class IniFoldingRangeProvider implements vscode.FoldingRangeProvider {
  provideFoldingRanges(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.FoldingRange[]> {
    const text = document.getText();
    const doc = parse(text, getParseOptions());
    const ranges: vscode.FoldingRange[] = [];

    for (const section of doc.sections) {
      if (section.range.end.line > section.range.start.line) {
        ranges.push(
          new vscode.FoldingRange(
            section.range.start.line,
            section.range.end.line,
            vscode.FoldingRangeKind.Region
          )
        );
      }
    }

    return ranges;
  }
}

/**
 * Update diagnostics for a document
 */
function updateDiagnostics(document: vscode.TextDocument) {
  const config = vscode.workspace.getConfiguration('ini.validation');
  const text = document.getText();
  const doc = parse(text, getParseOptions());

  const diagnostics = validate(doc, {
    checkDuplicateSections: config.get('checkDuplicateSections', true),
    checkDuplicateKeys: config.get('checkDuplicateKeys', true),
    checkEmptySections: config.get('checkEmptySections', false),
  });

  const vscodeDiagnostics: vscode.Diagnostic[] = diagnostics.map((d) => {
    const range = new vscode.Range(
      d.range.start.line,
      d.range.start.character,
      d.range.end.line,
      d.range.end.character
    );

    const severity = convertSeverity(d.severity);
    const diagnostic = new vscode.Diagnostic(range, d.message, severity);
    diagnostic.code = d.code;
    diagnostic.source = 'ini';
    return diagnostic;
  });

  diagnosticCollection.set(document.uri, vscodeDiagnostics);
}

/**
 * Convert INI diagnostic severity to VS Code severity
 */
function convertSeverity(
  severity: IniDiagnosticSeverity
): vscode.DiagnosticSeverity {
  switch (severity) {
    case IniDiagnosticSeverity.Error:
      return vscode.DiagnosticSeverity.Error;
    case IniDiagnosticSeverity.Warning:
      return vscode.DiagnosticSeverity.Warning;
    case IniDiagnosticSeverity.Information:
      return vscode.DiagnosticSeverity.Information;
    case IniDiagnosticSeverity.Hint:
      return vscode.DiagnosticSeverity.Hint;
    default:
      return vscode.DiagnosticSeverity.Warning;
  }
}

/**
 * Get format options from configuration
 */
function getFormatOptions(): FormatOptions {
  const config = vscode.workspace.getConfiguration('ini.format');
  return {
    insertSpaces: config.get('insertSpaces', true),
    alignValues: config.get('alignValues', false),
    sectionSpacing: config.get('sectionSpacing', 1),
    sortSections: config.get('sortSections', false),
    sortKeys: config.get('sortKeys', false),
    delimiter: config.get('delimiter', '='),
    preserveDelimiters: config.get('preserveDelimiters', false),
  };
}

function getParseOptions(): ParseOptions {
  const config = vscode.workspace.getConfiguration('ini.parse');
  return {
    inlineCommentMode: config.get('inlineCommentMode', 'legacy'),
  };
}

function extractFirstDefinedLine(message: string): number | undefined {
  const match = /first\s+defined\s+at\s+line\s+(\d+)/i.exec(message);
  if (!match) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) ? value : undefined;
}

function extractDuplicateKeyInfo(
  message: string
): { key: string; sectionName?: string } | undefined {
  const keyMatch = /Duplicate\s+key\s+"([^"]+)"/i.exec(message);
  if (!keyMatch) return undefined;
  const key = keyMatch[1];

  const sectionMatch = /in\s+section\s+\[([^\]]+)\]/i.exec(message);
  const sectionName = sectionMatch ? sectionMatch[1] : undefined;

  return { key, sectionName };
}

function extractDuplicateSectionInfo(
  message: string
): { name: string } | undefined {
  const match = /Duplicate\s+section\s+"([^"]+)"/i.exec(message);
  if (!match) return undefined;
  return { name: match[1] };
}

function findSectionNodeByLine(
  doc: {
    sections: Array<{
      name: string;
      range: { start: { line: number }; end: { line: number } };
    }>;
  },
  line: number
):
  | {
      name: string;
      range: {
        start: { line: number; character?: number };
        end: { line: number; character?: number };
      };
    }
  | undefined {
  return doc.sections.find((s) => s.range.start.line === line);
}

function findPropertyNode(
  doc: {
    globalProperties: Array<any>;
    sections: Array<{ name: string; properties: Array<any> }>;
  },
  line: number,
  key: string,
  sectionName?: string
): any | undefined {
  const lowerKey = key.toLowerCase();

  if (sectionName) {
    const section = doc.sections.find(
      (s) => s.name.toLowerCase() === sectionName.toLowerCase()
    );
    if (!section) return undefined;
    return section.properties.find(
      (p: any) =>
        p.range.start.line === line && p.key.toLowerCase() === lowerKey
    );
  }

  return doc.globalProperties.find(
    (p: any) => p.range.start.line === line && p.key.toLowerCase() === lowerKey
  );
}

function generateUniqueKeyName(
  doc: {
    globalProperties: Array<{ key: string }>;
    sections: Array<{ name: string; properties: Array<{ key: string }> }>;
  },
  baseKey: string,
  sectionName?: string
): string {
  const existing = new Set<string>();
  if (sectionName) {
    const section = doc.sections.find(
      (s) => s.name.toLowerCase() === sectionName.toLowerCase()
    );
    for (const p of section?.properties ?? [])
      existing.add(p.key.toLowerCase());
  } else {
    for (const p of doc.globalProperties) existing.add(p.key.toLowerCase());
  }

  for (let i = 2; i < 10_000; i++) {
    const candidate = `${baseKey}_${i}`;
    if (!existing.has(candidate.toLowerCase())) return candidate;
  }

  return `${baseKey}_${Date.now()}`;
}

function generateUniqueSectionName(
  doc: { sections: Array<{ name: string }> },
  baseName: string
): string {
  const existing = new Set(doc.sections.map((s) => s.name.toLowerCase()));
  for (let i = 2; i < 10_000; i++) {
    const candidate = `${baseName}_${i}`;
    if (!existing.has(candidate.toLowerCase())) return candidate;
  }
  return `${baseName}_${Date.now()}`;
}

function getSectionNameRangeFromHeader(
  line: number,
  headerLine: string
): vscode.Range | undefined {
  const open = headerLine.indexOf('[');
  const close = headerLine.indexOf(']');
  if (open === -1 || close === -1 || close <= open) return undefined;
  return new vscode.Range(line, open + 1, line, close);
}

function getSectionDeletionRange(
  document: vscode.TextDocument,
  section: { range: { start: { line: number }; end: { line: number } } }
): vscode.Range | undefined {
  const startLine = section.range.start.line;
  const endLine = section.range.end.line;

  if (startLine < 0 || endLine < startLine || startLine >= document.lineCount) {
    return undefined;
  }

  const start = document.lineAt(startLine).range.start;
  const end =
    endLine < document.lineCount - 1
      ? document.lineAt(endLine).rangeIncludingLineBreak.end
      : document.lineAt(endLine).range.end;

  return new vscode.Range(start, end);
}

function getDiagnosticCodeString(
  code: vscode.Diagnostic['code']
): string | undefined {
  if (!code) return undefined;
  if (typeof code === 'string') return code;
  if (typeof code === 'number') return String(code);
  if (typeof code === 'object' && 'value' in code) {
    const value = (code as { value: unknown }).value;
    return typeof value === 'string' ? value : undefined;
  }
  return undefined;
}

async function goToFirstDefinition(uri: vscode.Uri, line: number) {
  const doc = await vscode.workspace.openTextDocument(uri);
  const editor = await vscode.window.showTextDocument(doc, { preview: false });

  const safeLine = Math.max(0, Math.min(line, doc.lineCount - 1));
  const pos = new vscode.Position(safeLine, 0);
  editor.selection = new vscode.Selection(pos, pos);
  editor.revealRange(
    new vscode.Range(pos, pos),
    vscode.TextEditorRevealType.InCenter
  );
}

/**
 * Format document command
 */
async function formatDocument() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'ini') {
    vscode.window.showWarningMessage('Please open an INI file to format');
    return;
  }

  const text = editor.document.getText();
  const doc = parse(text, getParseOptions());
  const formatted = format(doc, getFormatOptions());

  await editor.edit((editBuilder) => {
    const fullRange = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(text.length)
    );
    editBuilder.replace(fullRange, formatted);
  });
}

/**
 * Convert INI to JSON command
 */
async function convertToJson() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'ini') {
    vscode.window.showWarningMessage('Please open an INI file to convert');
    return;
  }

  const text = editor.document.getText();
  const doc = parse(text, getParseOptions());
  const json = toJSON(doc);

  const newDoc = await vscode.workspace.openTextDocument({
    content: json,
    language: 'json',
  });
  await vscode.window.showTextDocument(newDoc);
}

/**
 * Sort sections command
 */
async function sortSections() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'ini') {
    vscode.window.showWarningMessage('Please open an INI file');
    return;
  }

  const text = editor.document.getText();
  const doc = parse(text, getParseOptions());
  const formatted = format(doc, { ...getFormatOptions(), sortSections: true });

  await editor.edit((editBuilder) => {
    const fullRange = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(text.length)
    );
    editBuilder.replace(fullRange, formatted);
  });
}

/**
 * Sort keys command
 */
async function sortKeys() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== 'ini') {
    vscode.window.showWarningMessage('Please open an INI file');
    return;
  }

  const text = editor.document.getText();
  const doc = parse(text, getParseOptions());
  const formatted = format(doc, { ...getFormatOptions(), sortKeys: true });

  await editor.edit((editBuilder) => {
    const fullRange = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(text.length)
    );
    editBuilder.replace(fullRange, formatted);
  });
}
