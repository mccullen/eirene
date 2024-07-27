import { useContext } from "react";
import { GlobalContext } from "./global-provider";
import Collapsible from "./collapsible";

export default function ObjectExplorer() {
    const { databases } = useContext(GlobalContext);
    return (
        <div id="obj-explorer">
            {Object.keys(databases).map(dbName => {
                
                const items = [
                    { title: 'Section 1', content: <h1 className="bg-gray-500">Content for section 1</h1>, open: false },
                    { title: 'Section 2', content: 'Content for section 2', open: false },
                    { title: 'Section 3', content: 'Content for section 3', open: false },
                  ];
                return ( 
                    <Collapsible items={items} />
                );
            })}
        </div>
    );
}