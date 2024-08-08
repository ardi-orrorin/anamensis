import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {System} from "@/app/user/system/{services}/types";

export async function GET(req: NextRequest,{params}: {params: {id: string}}) {
    const {id} = params;

    const res = await apiCall<System.SysMessage[]>({
        path: `/admin/api/sys-message/web-sys/${id}`,
        method: 'GET',
        call: 'Server',
        params,
        setAuthorization: true,
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(res), {
        status: 200,
    });

}