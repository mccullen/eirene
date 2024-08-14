//const baseUrl = "https://api.ohdsi.org/WebAPI";
//const baseUrl = "https://atlas-demo.ohdsi.org/WebAPI";
const baseUrl = "https://atlas-demo.ohdsi.org/WebAPI";
const translatePath = "/sqlrender/translate";

export interface TranslateBody {
    parameters?: any,
    targetdialect: string,
    SQL: string
}


// Old translate method
/*
export async function translate(payload: TranslateBody) {
    debugger;
    const body = JSON.stringify(payload);
    console.log(baseUrl);
    let response = await fetch(`${baseUrl}${translatePath}`, {
        method: "POST",
        //mode: "no-cors",
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
    });
    let json = await response.json();
    let targetSQL = json.targetSQL;
    return targetSQL;
}
*/

export async function translate(payload: TranslateBody) {
    const body = JSON.stringify(payload);

    try {
        const response = await fetch('/.netlify/functions/translate', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        const targetSQL = json.targetSQL;
        return targetSQL;
    } catch (error) {
        console.error('Error during translation:', error);
        throw error;
    }
}