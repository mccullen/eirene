import { useContext, useState } from "react";
import { GlobalContext } from "./global-provider";
import { downloadDb } from "@/services/util";



export default function Toolbar({ onExecute, dialect, setDialect, errorMsg, successMsg }) {
    const { getCurrentDatabase, dbReady } = useContext(GlobalContext);
    const [disabled, setDisabled] = useState<boolean>(true);

    return (
      <div id="tool-bar" className="pb-2 border-b border-gray-200 bg-gray-50 p-2 flex justify-between items-center">
        {/* Left aligned items */}
        <div className="flex space-x-4">
            {/* Execute */}
            <button 
                id="exe-btn" 
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${dbReady ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!dbReady}
                onClick={onExecute}
            >
                Execute
            </button>
            {/* Error and Success Messages */}
            <div>
                {errorMsg && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded z-50" role="alert">
                    <span className="block sm:inline">{errorMsg}</span>
                </div>
                )}
                {successMsg && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded z-50" role="alert">
                    <span className="block sm:inline">{successMsg}</span>
                </div>
                )}
            </div>
        </div>

        {/* Right aligned */}
        <div className="flex space-x-4">
            <button 
                className="bg-green-500 hover:bg-green-700 px-4 py-2 rounded text-white font-bold"
                onClick={() => downloadDb(getCurrentDatabase())}
            >
                Download
            </button>
            <select
                value={dialect}
                onChange={event => setDialect(event.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded ml-4"
            >
                <option value="ohdsisql">OHDSI SQL</option>
                <option value="sqlite">SQLite</option>
            </select>
        </div>
      </div>
    );
}