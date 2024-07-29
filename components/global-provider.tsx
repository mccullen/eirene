"use client"
import { createContext, useEffect, useState } from "react";
import initSqlJs from "sql.js";
import { getColumns, getTableObjs, getTables } from "@/services/db";
import { Monaco, loader } from "@monaco-editor/react";
import { registerAutocomplete } from "@/services/util";

const GlobalContext = createContext<any>(null);

function getUniqueKey(key, obj) {
    let i = 2;
    if (key in obj) {
        key += `-${i}`;
        ++i;
    }
    while (key in obj) {
        key = key.replace(/-\d$/, `-${i}`);
    }
    return key;
}

function GlobalProvider({children}) {
    const [databases, setDatabases] = useState<any>({});
    const [currentDatabaseName, setCurrentDatabaseName] = useState<string>("");
    const [dbReady, setDbReady] = useState(false);
    const [defaultValue, setDefaultValue ] = useState<string>(`select *
from person p
inner join condition_occurrence co on p.
where p.person_id = 0;`);
    const [rowsAndCols, setRowsAndCols] = useState<any[]>();
    const [resultVis, setResultVis] = useState<boolean>(false);
    const [dialect, setDialect] = useState('ohdsisql');
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [successMsg, setSuccessMsg] = useState<string>("");
    const [activeTab, setActiveTab] = useState(0);
    const [splitSizes, setSplitSizes] = useState<number[]>([50, 50]);
    const [splitSizesHorizontal, setSplitSizesHorizontal] = useState<number[]>([20, 80]);
    const [monaco, setMonaco] = useState<Monaco|null>(null);
    const [autocompleteDispose, setAutoCompleteDispose] = useState<any>(null);

    useEffect(() => {
        const init = async () => {
            const newMonaco = await loader.init();
            setMonaco(newMonaco);
        };
        init();
    }, []);

    useEffect(() => {
        if (monaco && databases[currentDatabaseName]?.tables) {
            autocompleteDispose?.dispose();
            const newAutoCompleteDispose = registerAutocomplete(monaco, databases?.[currentDatabaseName]?.tables);
            setAutoCompleteDispose(newAutoCompleteDispose);
        }
    }, [monaco, currentDatabaseName]);

    const connectDatabase = async (name, sqliteBuffer) => {
        name = getUniqueKey(name, databases);
        if (!databases[name]) {
            const SQL = await initSqlJs({
                // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
                // You can omit locateFile completely when running in node
                locateFile: file => {
                    return file;
                }
            });
            const database = new SQL.Database(new Uint8Array(sqliteBuffer));
            const tables = getTableObjs(database);
            setDatabases((prevDatabases) => ({
                ...prevDatabases,
                [name]: {
                    tables: tables,
                    database: database
                }
            }));
        }
        setCurrentDatabaseName(name);
        setDbReady(true);
    };

    const removeDatabase = (name) => {
        const {[name]: _, ...newDatabases } = databases;
        setDatabases(newDatabases);
        if (name === currentDatabaseName) {
            // If you removed currently selected db, just connect to the first db in the list
            let names  = getDatabaseNames();
            if (names && names.length > 0) {
                setCurrentDatabaseName(names[0]);
            }
        }
    };
    
    const getCurrentDatabase = () => {
        return dbReady && currentDatabaseName ? databases[currentDatabaseName].database : null;
    };

    const getDatabaseNames = () => {
        return Object.keys(databases);
    }

    let val = {
        databases,
        connectDatabase,
        dbReady,
        // Returns current database object that you can query
        getCurrentDatabase,
        // The unique name (key) of the current database object for querying
        currentDatabaseName,
        setCurrentDatabaseName, // allows user to change current database with select option
        getDatabaseNames,
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
        setSplitSizesHorizontal,
        removeDatabase,
    };


    return (
        <GlobalContext.Provider value={val}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };