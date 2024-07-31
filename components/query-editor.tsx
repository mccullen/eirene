"use client"
import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';
import { initVimMode } from 'monaco-vim';
import { Editor } from '@monaco-editor/react';
import { GlobalContext } from './global-provider';
import ResultTable from './result-table';
import { sendGTMEvent } from '@next/third-parties/google'
import Split from 'react-split'
import Toolbar from "./toolbar";
import { translate, TranslateBody } from "@/services/web-api";
import { getHighlightedText, getColsAndRows, round } from "@/services/util";
import ObjectExplorer from "./object-explorer";
import Tabs from "./tabs";

export default function QueryEditor(props) {
    const { 
        getCurrentDatabase, 
        defaultValue, 
        setDefaultValue, 
        rowsAndCols, 
        setRowsAndCols, 
        resultVis, 
        setResultVis, 
        dialect, 
        setDialect,
        activeTab, 
        setActiveTab,
        splitSizes, 
        setSplitSizes,
        errorMsg,
        setErrorMsg,
        successMsg,
        setSuccessMsg,
        splitSizesHorizontal,
        setSplitSizesHorizontal
    } = useContext(GlobalContext);

    let editorRef = useRef<any>(null);
    let monacoRef = useRef(null);
    let exec = useRef<any>(false);

    function beforeMount(monaco) {
        monacoRef.current = monaco;
    }

    function onMount(editor, monaco) {
        editorRef.current = editor;

        // Default makes pressing enter do autocomplete, which is really annoying IMO
        /*
        editor.onKeyDown((e) => {
          if (e.keyCode === monaco.KeyCode.Enter) {
            e.preventDefault(); // Prevent autocomplete acceptance
            
            // Insert a new line at the current cursor position
            editor.executeEdits('', [{
              range: editor.getSelection(),
              text: '\n'
            }]);
          }
        });
        */

        //const vimMode = initVimMode(editor, document.getElementById("vim"));
    }

    function onChange(value, event) {
        /*
        setDefaultValue(value);
        console.log(value);
        const editor = editorRef.current;
        if (editor) {
            const model = editor.getModel();
            const lastLine = model.getLineCount();
            const cursorPosition = editor.getPosition();

            // Check if the current line is the last line
            if (cursorPosition.lineNumber === lastLine) {
                editor.revealLineInCenter(lastLine); // Scroll to the bottom
            }
        }
            */
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
        {/*
                <Editor 
                    className="z-20"
                    height="200px"
                    width="500px"
                    theme="light"
                    defaultLanguage='sql'
                    defaultValue={"test"}
                    onMount={onMount}
                    beforeMount={beforeMount}
                    options={{minimap: {enabled: false}}}
                />
                */}

      <div id="split-wrapper">
        <Split
            className="split-horizontal"
            minSize={0}
            onDragEnd={(sizes) => {
              setSplitSizesHorizontal(sizes);
            }}
            sizes={splitSizesHorizontal}
        >
          <ObjectExplorer />
          <div id="right-side-split">
            <Split
                className="split-vertical"
                direction="vertical"
                minSize={0}
                onDragEnd={(sizes) => {
                    setSplitSizes(sizes);
                }}
                sizes={splitSizes} 
            >
              <div id="top-pane" className="flex flex-col">
                <Toolbar 
                    onExecute={onExecute} 
                    dialect={dialect} 
                    setDialect={setDialect} 
                    errorMsg={errorMsg}
                    successMsg={successMsg}
                />
                <Editor 
                    height="100%"
                    width="100%"
                    theme="light"
                    defaultLanguage='sql'
                    defaultValue={defaultValue || "SELECT * FROM person LIMIT 100;"}
                    onChange={onChange}
                    onMount={onMount}
                    beforeMount={beforeMount}
                    options={
                        {
                            minimap: {enabled: false},
                            acceptSuggestionOnEnter: "off"
                        }
                    }
                />
              </div>
              <div id="bottom-pane" className="overflow-x-auto overflow-y-auto relative z-10">
                <div id="vim"></div>
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
        </Split>
      </div>
    </div>
  );
}