const baseUrl = "https://api.ohdsi.org/WebAPI/";

export interface TranslateBody {
    parameters?: any,
    targetdialect: string,
    SQL: string
}

export async function translate(payload: TranslateBody) {
    const body = JSON.stringify(payload);
    let response = await fetch("https://api.ohdsi.org/WebAPI/sqlrender/translate", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
    });
    let json = await response.json();
    let targetSQL = json.targetSQL;
    return targetSQL;
}