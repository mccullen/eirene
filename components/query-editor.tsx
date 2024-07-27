"use client"
import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';
import { Editor } from '@monaco-editor/react';
import { GlobalContext } from './global-provider';
import ResultTable from './result-table';
import { sendGTMEvent } from '@next/third-parties/google'
import Split from 'react-split'
import Toolbar from "./toolbar";
import { translate, TranslateBody } from "@/services/web-api";
import { getHighlightedText, getColsAndRows, round } from "@/services/util";
import Tabs from "./tabs";

export default function QueryEditor(props) {
    const { getCurrentDatabase } = useContext(GlobalContext);
    const [dialect, setDialect] = useState('ohdsisql');
    let editorRef = useRef<any>(null);
    let monacoRef = useRef(null);
    let [errorMsg, setErrorMsg] = useState<string>("");
    let [successMsg, setSuccessMsg] = useState<string>("");
    let [resultVis, setResultVis] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState(0);
    let [rowsAndCols, setRowsAndCols] = useState<any[]>([
    ]);
    let [splitSizes, setSplitSizes] = useState<number[]>([50, 50]);
    let [columns, setColumns] = useState<any[]>([
    ]);
    let [data, setData] = useState<any[]>([
    ]);
    let exec = useRef<any>(false);

    function beforeMount(monaco) {
        monacoRef.current = monaco;
    }

    function onMount(editor, monaco) {
        editorRef.current = editor;
    }

    function onChange(value, event) {
        //console.log(value);
        //console.log(event);
    }
    

    async function onExecute(event) {
        exec.current = true;
        // Hide results while executing. Will show if no error occurs
        setResultVis(false);
        sendGTMEvent({"event": "onExecute", value: "abc", junk: "world"});

        // Gets only highlighted text
        const highlightedText = getHighlightedText(editorRef.current);

        // If text is highlighted, just use that, not the full text
        let query = "";
        if (highlightedText) {
            query = highlightedText;
        } else {
            // Gets the full text
            query = editorRef.current.getValue();
        }

        if (dialect === "ohdsisql") {
            // ohdsi sql selected, so translate to sqlite
            const body: TranslateBody = {
                targetdialect: "sqlite",
                SQL: query
            }
            query = await translate(body);
        } 

        // Now try and execute the query
        try {
            console.log("Executing query:");
            console.log(query);

            // Executing query and getting exec time
            const start = performance.now();
            const result = getCurrentDatabase().exec(query);
            const end = performance.now();
            let executionTime = round(end - start, 2);

            
            if (result.length > 0) {
                // Only extract result if there are any
                // We allow you to exec sql that has no result (ex: inserts into tables, etc.)

                const rowCols = result.map(r => getColsAndRows(r));
                setRowsAndCols(rowCols);

                // Just take the last one for now
                const r1: any = result[result.length-1];
                const {cols, rows} = getColsAndRows(r1);

                setColumns(cols);
                setData(rows);
                setActiveTab(0);

                // Since there are results, we want to show them...
                setResultVis(true);
            }

            // Clear error and set success msg
            setErrorMsg(m => "");
            setSuccessMsg(m => `Execution time ${executionTime}ms`);
        } catch (error: any) {
            setErrorMsg(error.message);
            setSuccessMsg("");
        }
    }

  return (
    <div id="query-editor-wrapper" className="mt-2 border border-gray-300 rounded-lg shadow-md bg-white">
      <Toolbar 
        onExecute={onExecute} 
        dialect={dialect} 
        setDialect={setDialect} 
        errorMsg={errorMsg}
        successMsg={successMsg}
      />

      <div id="split-wrapper">
        <Split
            className="split"
            direction="vertical"
            minSize={0}
            sizes={splitSizes} // You can set initial sizes here
        >
          <div id="top-pane">
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
          </div>
          <div id="bottom-pane" className="overflow-x-auto overflow-y-auto">
            { 
              resultVis && (
                <Tabs n={rowsAndCols.length} activeTab={activeTab} onClick={(event, i) => {
                  setActiveTab(i);
                }} />
              )
            }
            { 
              resultVis && rowsAndCols.map((rc, i) => {
                const {rows, cols} = rc;
                return (
                  <ResultTable 
                    id={`result-table-${i}`}
                    key={i}
                    className={`result-tbl ${activeTab === i ? 'block' : 'hidden'}`} 
                    columns={cols} 
                    data={rows} 
                  />
                )
              })
            }
          </div>
        </Split>
      </div>
    </div>
  );
}