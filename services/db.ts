export function listTables(db) {
    const sql = 
`SELECT name
FROM sqlite_master
WHERE type='table';`;

}

export function listColumns(db, table) {
    const sql = `PRAGMA table_info('${table}');`;
}