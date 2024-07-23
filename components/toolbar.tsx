
export default function Toolbar({ onExecute, dialect, setDialect }) {

    return (
      <div id="tool-bar" className="pb-2 border-b border-gray-200 bg-gray-50 p-2 flex justify-between items-center">
        <button id="exe-btn" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={onExecute}>Execute</button>
        <select
            value={dialect}
            onChange={event => setDialect(event.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded ml-4"
        >
        <option value="ohdsisql">OHDSI SQL</option>
        <option value="sqlite">SQLite</option>
      </select>
      </div>
    );
}