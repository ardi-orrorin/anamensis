import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {NextRequest, NextResponse} from "next/server";
import {WebSysI} from "@/app/user/system/page";

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/web-sys';

    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const res:AxiosResponse<WebSysI[]> = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(JSON.stringify(res.data), {
        status: 200,
    });
}

export async function POST(req: NextRequest) {
    const data = await req.json() as WebSysI;

    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/web-sys';

    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const res = await axios.post(url, data, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(null, {
        status: 200,
    });
}

export async function PUT(req: NextRequest) {

    const data = await req.json() as WebSysI;

    console.log(data)

    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/web-sys';

    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const res = await axios.put(url, data, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(null, {
        status: 200,
    });
}