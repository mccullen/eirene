"use client"
import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';

import { Editor } from '@monaco-editor/react';
import { GlobalContext } from './shell';
import ResultTable from './result-table';
import { ResizableBox } from 'react-resizable';
import SplitPane from "react-split-pane";
import { Pane } from "react-split-pane";
import { sendGTMEvent } from '@next/third-parties/google'

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

    let solution: any = null;
    if (props.solution) {
      solution = (
            <div>
              <button id="exe-btn" className=" text-blue-500 px-2" onClick={event => {
                editorRef.current.getModel().setValue(props.solution);
                onExecute(event);
              }}>Show solution</button>
            </div>
      );
    }

const onResize = (event, { size }) => {
    setEditorHeight(size.height);
  };

    return (
        <div>
          <button id="exe-btn" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-2 px-4 rounded' onClick={onExecute}>Execute</button>
          <div className="border border-gray relative min-h-[30vh]">
            <div className="absolute inset-0 w-full h-full bg-lightblue">
              <Editor 
                height="100%"
                width="100%"
                theme="light"
                defaultLanguage='sql'
                defaultValue={props.defaultValue || "SELECT * FROM person LIMIT 100;"}
                onChange={onChange}
                onMount={onMount}
                beforeMount={beforeMount}
              />
            {solution}
            </div>
          </div>
        <span className="text-red-500">{errorMsg}</span>

        <div className="border-t border-gray-300 my-4"></div>

        <div className="overflow-x-auto max-h-[50vh]">
        <ResultTable className="result-tbl" columns={columns} data={data} />
        </div>
      </div>
    );
}