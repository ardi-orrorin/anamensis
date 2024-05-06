import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {SysMessageI} from "@/app/user/system/{components}/message";

export async function GET(req: NextRequest,{params}: {params: {id: string}}) {
    const {id} = params;
    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/sys-message/web-sys/'+id;

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const res:AxiosResponse<SysMessageI[]> = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(JSON.stringify(res.data), {
        status: 200,
    });

}