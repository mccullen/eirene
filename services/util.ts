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

/*
export function createDependencyProposals(monaco: Monaco, range, tables) {
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
}*/
// Function to extract table aliases and their corresponding tables from the SQL query
function getTableAliases(text: string): Record<string, string> {
    const aliases: Record<string, string> = {};
    // Example regex pattern for SQL table aliases
    const aliasPattern = /(\bFROM\b|\bJOIN\b)\s+(\w+)\s+(\w+)/gi;
    let match;
    while ((match = aliasPattern.exec(text)) !== null) {
        aliases[match[3]] = match[2]; // alias -> table
        aliases[match[2]] = match[2]; // table is an alias for itself
    }
    return aliases;
}

export function registerAutocomplete(monaco: Monaco, tables: any[]) {
    if (!monaco) {
        console.error("Monaco is not initialized.");
        return;
    }

    const dispose = monaco.languages.registerCompletionItemProvider('sql', {
        triggerCharacters: ["."],
        provideCompletionItems: function (model, position) {
            const items: any = [];
            const textUntilPosition = model.getValueInRange({
                startLineNumber: 1,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });
            console.log(textUntilPosition);

            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };

            //let colMatch = /(\w+)\.(\w*)/gi.exec(word.word);
            let colMatch;
            let match;
            const pattern =/(\w+)\.(\w*)/gi ;
            while(match = pattern.exec(textUntilPosition)) {
                colMatch = match;
            }
            if (colMatch && textUntilPosition.slice(-colMatch[0].length) === `${colMatch[0]}`) {
                // Suggest columns based on alias
                const alias = colMatch[1];
                const colSoFar = colMatch[2];
                console.log("colmatch!");
                // Get table aliases from the current text
                const aliasToTable = getTableAliases(textUntilPosition);
                const currentTableName = aliasToTable[alias];
                const table = tables.find(t => t.name === currentTableName);
                table?.columns?.forEach(column => {
                    items.push({
                        label: `${alias || table.name}.${column.name}`,
                        kind: monaco.languages.CompletionItemKind.Field,
                        documentation: `Column: ${column.name} in table ${table.name}`,
                        //insertText: `${alias || table.name}.${column.name}`,
                        insertText: `${column.name}`,
                        range: range,
                        commitCharacters: ["\t"]
                    });
                });
            } else {
                // Add table names as completion items
                tables.forEach(table => {
                    items.push({
                        label: table.name,
                        kind: monaco.languages.CompletionItemKind.Text,
                        documentation: `Table: ${table.name}`,
                        insertText: table.name,
                        range: range,
                    });
                });
            }

            return {
                suggestions: items
            };
        },
    });
    return dispose;
}