export function getTables(db) {
    const sql = 
`SELECT name
FROM sqlite_master
WHERE type='table';`;
    const result = db.exec(sql);
    const tables = result[0].values.flatMap(val => val[0]);
    return tables;
}

export function getColumns(db, table) {
    const sql = `PRAGMA table_info('${table}');`;
    const result = db.exec(sql);
    const colNames = result[0].columns;
    let colObjs: any = [];
    result[0].values.map(col => {
        // Col looks like this ["person_id", 0, 1, ....]
        let colObj = {};
        col.forEach((val, i) => { colObj[colNames[i]] = val; });
        colObjs.push(colObj);
    });
    return colObjs;
}

export function getTableObjs(db) {
    const tables = getTables(db);
    const info = tables.map(t => {
        const cols = getColumns(db, t);
        return {
            "name": t,
            "columns": cols
        }
    });
    return info;
}

/*
{
    "gibleed": {
        "tables": [
            {
                "name": "person",
                "columns": [
                    {
                        "name": "person_id",
                        "cid": 0,
                        "type": "INTEGER",
                        "dflt_value": 0,
                        "pk": 0
                    }
                ]
            },
            ...
        ]
    },
    ...
}
*/