import {NextRequest, NextResponse} from "next/server";
import axios, {AxiosResponse} from "axios";
import {cookies} from "next/headers";
import {RateInfoI} from "@/app/board/[id]/page";


export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    if(!token) return new NextResponse(JSON.stringify({message: '로그인이 필요합니다.'}), {
        status: 401,
    });

    const url = process.env.NEXT_PUBLIC_SERVER + '/api/rate/add/' + id;

    const data = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
            'Content-Type': 'application/json',
        }})
        .then((res: AxiosResponse<RateInfoI>) => {
            return res.data;
        });

    return new NextResponse(JSON.stringify(data),{
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}