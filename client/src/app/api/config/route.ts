import ExNextResponse from "@/app/{commons}/func/ExNextResponse";


export interface NextJsConfigI {
    cdnServer: string
    baseUrl: string
    backendUrl: string
}

export function GET() {

    const config = {
        cdnServer: process.env.NEXT_PUBLIC_CDN_SERVER ?? '/files',
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
        backendUrl: process.env.NEXT_PUBLIC_SERVER ?? 'http://localhost:8080',
    } as NextJsConfigI;

    return ExNextResponse({
        body: JSON.stringify(config),
        status: 200
    })
}