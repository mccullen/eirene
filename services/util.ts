import { Monaco } from "@monaco-editor/react";

// Extracts highlighted text from monaco editor
export function getHighlightedText(editor) {
    // Get the text model
    const model = editor.getModel();

    // Get the selection range
    const selection = editor.getSelection();

    // Get the highlighted text
    const highlightedText = model.getValueInRange(selection);
    return highlightedText;
}


// Gets the columns and rows out of a sql.js result
// for use with react tables
export function getColsAndRows(result) {
    const cols = getCols(result);
    const rows = result.values.map((r) => {
        let row = {};
        r.forEach((v, i) => {
        row[cols[i].accessorKey] = v;
        });
        return row;
    });
    return {
        cols, rows
    }
}

export function getCols(result) {
    const cols = result.columns.map(c => { return { header: c, accessorKey: c} });
    return cols
}

export function round(input: number, nDecimalPlaces: number) {
    const d = Math.pow(10, nDecimalPlaces);
    return Math.round(input * d) / d;
}

export function downloadDb(db, filename) {
    // Export database to binary format
    const binaryArray = db.export();

    // Create blob from binary
    const blob = new Blob([binaryArray], { type: 'application/octet-stream' });

    // Create a download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.sqlite`; // Specify the filename

    // Trigger the download
    link.click();
}

export function createDependencyProposals(monaco: Monaco, range) {
    // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
    // here you could do a server side lookup
    return [
        {
            label: '"lodash"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "The Lodash library exported as Node.js modules.",
            insertText: '"lodash": "*"',
            range: range,
        },
        {
            label: '"express"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "Fast, unopinionated, minimalist web framework",
            insertText: '"express": "*"',
            range: range,
        },
        {
            label: '"mkdirp"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "Recursively mkdir, like <code>mkdir -p</code>",
            insertText: '"mkdirp": "*"',
            range: range,
        },
        {
            label: '"my-third-party-library"',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: "Describe your library here",
            insertText: '"${1:my-third-party-library}": "${2:1.2.3}"',
            insertTextRules:
                monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
        },
    ]; 
}

export function registerAutocomplete(monaco: Monaco|null, tables) {
    debugger;
    monaco?.languages.registerCompletionItemProvider("sql", {
        provideCompletionItems: function (model, position) {
            // find out if we are completing a property in the 'dependencies' object.
            var textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            /*
            var match = textUntilPosition.match(
                /"dependencies"\s*:\s*\{\s*("[^"]*"\s*:\s*"[^"]*"\s*,\s*)*([^"]*)?$/
            );
            if (!match) {
                return { suggestions: [] };
            }
                */
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };
            return {
                suggestions: createDependencyProposals(monaco, range),
            };
        },
    });
}