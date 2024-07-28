import { useContext } from "react";
import { GlobalContext } from "./global-provider";
import Collapsible from "./collapsible";

export default function ObjectExplorer() {
    const { databases } = useContext(GlobalContext);
    return (
        <div id="obj-explorer">
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
                    let tableItem = { title: t.name, content: <>{tableContent}</>, open: false };
                    let tableItems = [tableItem];
                    return (
                        <Collapsible key={`table-${i}`} items={tableItems} />
                    );
                });

                // content is now an array of collapse, so wrap all that in a db-lv collapse
                let item = { title: dbName, content: <>{content}</>, open: false}
                let items = [item];

                return ( 
                    <Collapsible key={dbName} items={items} />
                );
            })}
        </div>
    );
}