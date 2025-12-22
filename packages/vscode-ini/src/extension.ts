import * as vscode from 'vscode';
import {
  parse,
  format,
  validate,
  toJSON,
  FormatOptions,
  DiagnosticSeverity as IniDiagnosticSeverity,
} from '@leezgion/ini-parser';

let diagnosticCollection: vscode.DiagnosticCollection;

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

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('ini.format', formatDocument),
    vscode.commands.registerCommand('ini.convertToJson', convertToJson),
    vscode.commands.registerCommand('ini.sortSections', sortSections),
    vscode.commands.registerCommand('ini.sortKeys', sortKeys)
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

/**
 * Document Symbol Provider for Outline view
 */
class IniDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  provideDocumentSymbols(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.DocumentSymbol[]> {
    const text = document.getText();
    const doc = parse(text);
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
    const config = vscode.workspace.getConfiguration('ini.format');
    const options: FormatOptions = {
      insertSpaces: config.get('insertSpaces', true),
      alignValues: config.get('alignValues', false),
      sectionSpacing: config.get('sectionSpacing', 1),
      sortSections: config.get('sortSections', false),
      sortKeys: config.get('sortKeys', false),
    };

    const text = document.getText();
    const doc = parse(text);
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
    const doc = parse(text);
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
  const doc = parse(text);

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
  };
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
  const doc = parse(text);
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
  const doc = parse(text);
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
  const doc = parse(text);
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
  const doc = parse(text);
  const formatted = format(doc, { ...getFormatOptions(), sortKeys: true });

  await editor.edit((editBuilder) => {
    const fullRange = new vscode.Range(
      editor.document.positionAt(0),
      editor.document.positionAt(text.length)
    );
    editBuilder.replace(fullRange, formatted);
  });
}
