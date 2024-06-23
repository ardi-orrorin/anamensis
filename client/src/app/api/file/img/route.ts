import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";


export interface FileContentI{
    id          : number;
    tableCodePk : number;
    tableRefPk  : number;
    orgFileName : string;
    fileName    : string;
    filePath    : string;
    createAt    : string;
    isUse       : boolean;
}

export async function POST(req: NextRequest) {
    const body = await req.formData();

    const result = await apiCall<FileContentI>({
        path: '/api/files/content-img',
        method: 'POST',
        call: 'Server',
        contentType: 'multipart/form-data',
        setAuthorization: true,
        isReturnData: true,
        body,
    });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
