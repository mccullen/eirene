import { useContext } from "react";
import { GlobalContext } from "./global-provider";

export default function ObjectExplorer() {
    const { databases } = useContext(GlobalContext);
    return (
        <div id="obj-explorer">
            {Object.keys(databases).map(dbName => {
                return ( <div>{dbName}</div>);
            })}
        </div>
    );
}