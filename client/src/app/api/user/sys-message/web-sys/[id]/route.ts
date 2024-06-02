import {NextRequest, NextResponse} from "next/server";
import {SysMessageI} from "@/app/user/system/{components}/message";
import apiCall from "@/app/{commons}/func/api";

export async function GET(req: NextRequest,{params}: {params: {id: string}}) {
    const {id} = params;

    const res = await apiCall<SysMessageI[]>({
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