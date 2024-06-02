import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import {RateInfoI} from "@/app/board/[id]/page";
import apiCall from "@/app/{commons}/func/api";


export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    if(!token) return new NextResponse(JSON.stringify({message: '로그인이 필요합니다.'}), {
        status: 401,
    });

    const data = await apiCall<RateInfoI>({
        path: '/api/rate/add/' + id,
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(data),{
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}