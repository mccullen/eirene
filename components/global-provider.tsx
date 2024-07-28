"use client"
import { createContext, useState } from "react";
import initSqlJs from "sql.js";
import { getColumns, getTableObjs, getTables } from "@/services/db";

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
    const [defaultValue, setDefaultValue ] = useState<string>("select * from person limit 100;");
    const [rowsAndCols, setRowsAndCols] = useState<any[]>();
    const [resultVis, setResultVis] = useState<boolean>(false);
    const [dialect, setDialect] = useState('ohdsisql');


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
        setDialect
    };


    return (
        <GlobalContext.Provider value={val}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };