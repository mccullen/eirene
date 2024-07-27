"use client"
import { createContext, useState } from "react";
import initSqlJs from "sql.js";

const GlobalContext = createContext<any>(null);

function GlobalProvider({children}) {
    const [databases, setDatabases] = useState({});
    const [currentDatabase, setCurrentDatabase] = useState(null);
    const [dbReady, setDbReady] = useState(false);

    const connectDatabase = async (name, sqliteBuffer) => {
        if (!databases[name]) {
            const SQL = await initSqlJs({
                // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
                // You can omit locateFile completely when running in node
                locateFile: file => {
                    return file;
                }
            });
            const database = new SQL.Database(new Uint8Array(sqliteBuffer));
            setDatabases((prevDatabases) => ({
                ...prevDatabases,
                [name]: database,
            }));
        }
        setCurrentDatabase(name);
        setDbReady(true);
    };
    
    const getCurrentDatabase = () => {
        return dbReady && currentDatabase ? databases[currentDatabase] : null;
    };

    let val = {
        databases,
        connectDatabase,
        dbReady,
        getCurrentDatabase
    };


    return (
        <GlobalContext.Provider value={val}>
            {children}
        </GlobalContext.Provider>
    );
}

export { GlobalContext, GlobalProvider };