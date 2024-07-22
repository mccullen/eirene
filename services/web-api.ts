const baseUrl = "https://api.ohdsi.org/WebAPI";
const translatePath = "/sqlrender/translate";

export interface TranslateBody {
    parameters?: any,
    targetdialect: string,
    SQL: string
}

export async function translate(payload: TranslateBody) {
    const body = JSON.stringify(payload);
    let response = await fetch(`${baseUrl}${translatePath}`, {
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