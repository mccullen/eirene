"use client"
import { createContext, useEffect, useState } from "react";
import initSqlJs from "sql.js";
import { getColumns, getTableObjs, getTables } from "@/services/db";
import { Monaco, loader } from "@monaco-editor/react";
import { registerAutocomplete } from "@/services/util";

const GlobalContext = createContext<any>(null);


// Used to get a unique database name in the object explorer
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
    const [defaultValue, setDefaultValue ] = useState<string>(`select * from person limit 100;`);
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
        // Get the monaco editor instance, mainly for registering autocomplete
        init();
    }, []);

    useEffect(() => {
        // When the current database changes, we need to re-register autocomplete per the tables/cols in
        // the current database
        if (monaco && databases[currentDatabaseName]?.tables) {
            // Monaco initialized and current database present

            // Dispose old autocomplete from previous connection
            autocompleteDispose?.dispose();

            // Register new autocomplete based on new database tables/columns
            const newAutoCompleteDispose = registerAutocomplete(monaco, databases?.[currentDatabaseName]?.tables);

            // Persist the dispose so you can dispose the autocomplete when you load another DB
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
            // Add new database to the current databases
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
        // Remove the selected database
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