export default function Tabs ({n, activeTab, onClick}){
    return (
        <ul className="sticky top-0 left-0 z-10 bg-white flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
            {
            Array.from({length: n}, (_, i) => {
                return (
                    <li key={`tab-${i}`} className="me-1 mt-1">
                        <a onClick={(event) => onClick(event, i)} key={`tab-a-${i}`} href="#" aria-current="page" 
                        className={`${activeTab === i ? "bg-gray-300" : "bg-gray-100"} inline-block px-5 py-1 text-blue-600 bg-gray-100 rounded-t-lg dark:bg-gray-800 dark:text-blue-500`}>
                            Result {i+1}
                            </a>
                    </li>
                )
            })
            }
        </ul>
    );
}