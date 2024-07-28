import { useContext } from "react";
import { GlobalContext } from "./global-provider";
import Collapsible from "./collapsible";

export default function ObjectExplorer() {
    const { databases } = useContext(GlobalContext);
    return (
        <div id="obj-explorer">
            {Object.keys(databases).map(dbName => {
                let dbObj = databases[dbName];
                let content = dbObj.tables.map((t, i) => {
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
                    debugger;

                    let tableItem = { title: t.name, content: <>{tableContent}</>, open: false };
                    let tableItems = [tableItem];
                    return (
                        <Collapsible key={`table-${i}`} items={tableItems} />
                    );
                });
                let item = { title: dbName, content: <>{content}</>, open: false}
                let items = [item];

/*
                const items = [
                    { title: 'Section 1', content: <h1 className="bg-gray-500">Content for section 1</h1>, open: false },
                    { title: 'Section 2', content: 'Content for section 2', open: false },
                    { title: 'Section 3', content: 'Content for section 3', open: false },
                  ];
                  */
                return ( 
                    <Collapsible key={dbName} items={items} />
                );
            })}
        </div>
    );
}