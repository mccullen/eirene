import fetch from 'node-fetch';

const baseUrl = "https://api.ohdsi.org/WebAPI";
//const baseUrl = "https://atlas-demo.ohdsi.org/WebAPI";
const translatePath = "/sqlrender/translate";

export default async function translate(event, context) {
    try {
        const body = await event.json();

        const url = `${baseUrl}${translatePath}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return Response.json({
                statusCode: response.status,
                body: JSON.stringify({ error: `HTTP error! status: ${response.status}` })
            });
        }

        const json = await response.json();

        return Response.json(json);
    } catch (error) {
        console.error('Error during translation:', error);
        return Response.json({
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        });
    }
}
