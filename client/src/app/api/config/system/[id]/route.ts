import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function DELETE(req: NextRequest, {params}: {params: {id: string}}) {

    await apiCall<any>({
        path: `/admin/api/web-sys/code/${params.id}`,
        method: 'DELETE',
        call: 'Server',
        setAuthorization: true,
    });

    return new NextResponse(null, {
        status: 200,
    });
}