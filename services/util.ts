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