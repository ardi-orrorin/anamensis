import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {SysMessageI} from "@/app/user/system/{components}/message";

export async function GET(req: NextRequest) {

    const searchParams = new URLSearchParams(req.nextUrl.search);

    const id = searchParams.get('id')!;

    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/sys-message';

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const res:AxiosResponse<SysMessageI> = await axios.get(url, {
        params: {
            id: id
        },
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(JSON.stringify(res.data),{
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function POST(req: NextRequest) {
    const body = await req.json() as SysMessageI;
    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/sys-message';

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const res:AxiosResponse<SysMessageI> = await axios.post(url, body, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(JSON.stringify(res.data),{
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function PUT(req: NextRequest) {
    const body = await req.json() as SysMessageI;

    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/sys-message';

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const res:AxiosResponse<SysMessageI> = await axios.put(url, body, {
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(null,{
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function DELETE(req: NextRequest) {
    const searchParams = new URLSearchParams(req.nextUrl.search);

    const id = searchParams.get('id')!;

    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/sys-message';

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    console.log(url);
    console.log(id);

    const res:AxiosResponse<SysMessageI> = await axios.delete(url,{
        params: {
            id: id
        },
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(JSON.stringify(res.data),{
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}