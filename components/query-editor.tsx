"use client";
import React, { useEffect, useRef, useState, useMemo, useContext } from 'react';
import { Editor } from '@monaco-editor/react';
//import dynamic from 'next/dynamic';
//const Editor = dynamic(() => import("@monaco-editor/react").then(mod => ({ default: mod.Editor})), {ssr: false});
import { GlobalContext } from './global-provider';
import ResultTable from './result-table';
import { sendGTMEvent } from '@next/third-parties/google'
import Split from 'react-split'
import Toolbar from "./toolbar";
import { translate, TranslateBody } from "@/services/web-api";
import { getHighlightedText, getColsAndRows, round } from "@/services/util";
import ObjectExplorer from "./object-explorer";
import Tabs from "./tabs";
import * as monaco from 'monaco-editor';

export default function QueryEditor(props) {
    const { 
        getCurrentDatabase, 
        currentDatabaseName,
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
        vi,
        splitSizesHorizontal,
        setSplitSizesHorizontal
    } = useContext(GlobalContext);

    let editorRef = useRef<monaco.editor.IStandaloneCodeEditor|null>(null);
    const viRef = useRef<any>(null);
    const viModeRef = useRef<any>(null);
    let monacoRef = useRef(null);
    let vimRef = useRef<any>(null);

    useEffect(() => {
        async function init() {
            // Import uses client stuff, so you need to import in lifecycle method
            viRef.current = await import("monaco-vim");
        }
        init();
    }, []);


    useEffect(() => {
        // Need to add alt execution option using ctrl-enter here.
        // monaco doesn't like it when you put this in onMount
        addExecuteOption();
    }, [currentDatabaseName]);

    function addExecuteOption() {
        editorRef?.current?.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, function(editor, a, b, c) {
            onExecute();
        });
    }

    function handleViChecked(event, checked) {
        if (checked) {
            viModeRef.current = viRef.current.initVimMode(editorRef.current, vimRef.current);
            editorRef.current?.updateOptions({ cursorStyle: "block" });
            console.log(editorRef.current);
        } else {
            // dispose
            editorRef.current?.updateOptions({ cursorStyle: "line" });
            viModeRef?.current?.dispose();
        }
    }

    function beforeMount(monaco) {
        monacoRef.current = monaco;
    }

    function onMount(editor: monaco.editor.IStandaloneCodeEditor, monaco) {
        editorRef.current = editor;
        handleViChecked(null, vi);
        //addExecuteOption();
    }

    function onChange(value, event) {
        setDefaultValue(value);
    }
    

    async function onExecute(event?: Event) {
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
            query = editorRef.current?.getValue() || "";
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
                            <div id="top-pane" className="flex flex-col h-full">
                                <Toolbar 
                                    onExecute={onExecute} 
                                    dialect={dialect} 
                                    setDialect={setDialect} 
                                    errorMsg={errorMsg}
                                    successMsg={successMsg}
                                    onViChecked={handleViChecked}
                                />
                                <div id="editor-wrapper" className="flex-1 relative">
                                <Editor
                                    className="absolute inset-0"
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
                                            acceptSuggestionOnEnter: "off",
                                            contextmenu: false,
                                            cursorStyle: vi ? "block" : "line"
                                        }
                                    }
                                />
                                </div>
                                <div ref={vimRef} id="vim" className={`${vi ? 'block' : 'hidden'}`}></div>
                            </div>
                            <div id="bottom-pane" className="overflow-x-auto overflow-y-auto relative z-10">
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