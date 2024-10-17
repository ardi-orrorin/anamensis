import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export interface NextJsConfigI {
    cdnServer: string
    baseUrl: string
}

export function GET() {

    const config = {
        cdnServer: process.env.CDN_SERVER ?? '/files',
        baseUrl: process.env.BASE_URL ?? 'http://localhost:3000',
    } as NextJsConfigI;

    return ExNextResponse({
        body: JSON.stringify(config),
        status: 200
    })
}