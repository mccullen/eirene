export default function Tabs ({n}){
    debugger;
    return (
        <ul className="sticky top-0 z-10 flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
            {
            Array.from({length: n}, (_, i) => {
                return (
                    <li key={`tab-${i}`} className="me-2">
                        <a key={`tab-a-${i}`} href="#" aria-current="page" className="inline-block p-4 text-blue-600 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500">Result</a>
                    </li>
                )
            })
            }
        </ul>
    );
}