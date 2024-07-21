"use client"
import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';
import { Editor } from '@monaco-editor/react';
import { GlobalContext } from './shell';
import ResultTable from './result-table';
import { sendGTMEvent } from '@next/third-parties/google'
import Split from 'react-split'

function getHighlightedText(editor) {
  // Get the text model
  const model = editor.getModel();

  // Get the selection range
  const selection = editor.getSelection();

  // Get the highlighted text
  const highlightedText = model.getValueInRange(selection);
  return highlightedText;
}

export default function QueryEditor(props) {
  const db = useContext(GlobalContext);
  let editorRef = useRef<any>(null);
  let monacoRef = useRef(null);
  let [errorMsg, setErrorMsg] = useState<string>("");
  let [columns, setColumns] = useState<any[]>([
  ]);
  let [data, setData] = useState<any[]>([
  ]);
  const [editorHeight, setEditorHeight] = useState(300); // Initial height for the editor

  function onChange(value, event) {
    console.log("changed");
    console.log(value);
    console.log(event);
  }
  
  function onMount(editor, monaco) {
    editorRef.current = editor;
    console.log("mounted");
    console.log(editor);
    console.log(monaco);
  }
  
  function beforeMount(monaco) {
    monacoRef.current = monaco;
  }

  function onExecute(event) {
    console.log(editorRef.current);
    console.log("sending event");
    sendGTMEvent({"event": "onExecute", value: "abc", junk: "world"});
    const highlightedText = getHighlightedText(editorRef.current);
    const query = editorRef.current.getValue();
    /*
    cdm.current.each(query, function(row, index, c) {
      debugger;
    });
    */
    try {
      const result = db.exec(query);
      const r1: any = result[0];
      const cols = r1.columns.map(c => { return { header: c, accessorKey: c} });
      const rows = r1.values.map((r) => {
        let row = {};
        r.forEach((v, i) => {
          row[cols[i].accessorKey] = v;
        });
        return row;
      });


      setColumns(cols);
      setData(rows);
      console.log(highlightedText);
      setErrorMsg(m => "");
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  }

  return (
    <div id="query-editor-wrapper" className="mt-2 border border-gray-300 rounded-lg shadow-md bg-white">
      <div id="tool-bar" className="pb-2 border-b border-gray-200 bg-gray-50 p-2 flex justify-between items-center">
        <button id="exe-btn" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={onExecute}>Execute</button>
      </div>
      <div id="split-wrapper">
        <Split
            className="split"
            direction="vertical"
            minSize={0}
            sizes={[75, 25]} // You can set initial sizes here
        >
          <div id="top-pane">
            <Editor 
              height="90%"
              width="100%"
              theme="light"
              defaultLanguage='sql'
              defaultValue={props.defaultValue || "SELECT * FROM person LIMIT 100;"}
              onChange={onChange}
              onMount={onMount}
              beforeMount={beforeMount}
            />
          </div>
          <div id="bottom-pane" className="overflow-x-auto overflow-y-auto">
            <div className="text-red-500 mt-5">{errorMsg}</div>
            <ResultTable className="result-tbl" columns={columns} data={data} />
          </div>
        </Split>
      </div>
    </div>
  );
}