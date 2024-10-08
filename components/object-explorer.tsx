import { useContext } from "react";
import { GlobalContext } from "./global-provider";
import Collapsible from "./collapsible";
import FileButton from "./file-button";

export default function ObjectExplorer() {
    const { databases, connectDatabase, currentDatabaseName, removeDatabase, setCurrentDatabaseName } = useContext(GlobalContext);

    function onNewConnectionClick(event) {
        const files = event.target.files;
        if (files && files?.length > 0) {
            const file = files[0];
            // Replace everything after the last "." with nothing to get file name without extension
            // We will use this as the db name
            const fileNameNoExtension = file.name.replace(/\..*$/, "");
            const reader = new FileReader();
            reader.onload = function () {
                const result = reader.result as ArrayBuffer;
                connectDatabase(fileNameNoExtension, result)
            };
            reader.readAsArrayBuffer(file);
            // Change event will not trigger if the same file name is used
            // This resets the value to "" so it will.
            event.target.value = "";
        }
    }
    return (
        <div id="obj-explorer" className="border-b border-gray-200 bg-gray-50 pl-2 pt-2 flex flex-col">
            <div className="border-b border-gray-200 bg-gray-50 pb-2">
                <FileButton
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    onClick={onNewConnectionClick}
                >
                    New Connection
                </FileButton>
            </div>
            <div className="overflow-auto">
            {Object.keys(databases).map(dbName => {
                // Get all the info for this database
                let dbObj = databases[dbName];

                // Make a collapse for each database, containing all the tables
                // The tables also need to have a collapse with all of the columns

                // For each table, prepare a collapse with all the columns
                let content = dbObj.tables.map((t, i) => {
                    // Getting all the columns in a div.
                    // The columns do not need anything to collapse
                    let tableContent = t.columns.map((c, i) => {
                        return (
                            <div 
                                key={`col-${i}`}
                                className=""
                            >
                                {c.name} ({c.type})
                            </div>
                        );
                    });

                    // Make the columns the content of the table level collapse
                    let tableItem = {
                        title: <div className={`text-gray-700`}>{t.name}</div>, 
                        content: <div className={`text-gray-500`}>{tableContent}</div>, 
                        open: false 
                    };
                    let tableItems = [tableItem];
                    return (
                        <Collapsible key={`table-${i}`} items={tableItems} />
                    );
                });

                const title = 
                    <div className={`${dbName === currentDatabaseName ? "text-green-500" : "text-gray-700"} group font-bold`}>{dbName}{dbName === currentDatabaseName ? " *" : ""} 
                        <button className="relative opacity-0 group-hover:opacity-50 pl-2 transition-opacity duration-300 text-gray-500 hover:text-red-500 focus:outline-none"
                            onClick={(event) => { 
                                event.stopPropagation();
                                setCurrentDatabaseName(dbName)
                            }
                        }>✅</button>
                        <button className="relative left-0 opacity-0 group-hover:opacity-50 pl-0 transition-opacity duration-300 text-gray-500 hover:text-red-500 focus:outline-none"
                            onClick={(event) => { 
                                event.stopPropagation(); 
                                removeDatabase(dbName)
                            }
                        }>❌</button>
                    </div>;
                // content is now an array of collapse, so wrap all that in a db-lv collapse
                let item = { 
                    title,
                    content: <>{content}</>, 
                    open: false
                }
                let items = [item];

                return ( 
                    <Collapsible key={dbName} items={items} />
                );
            })}
            </div>
        </div>
    );
}