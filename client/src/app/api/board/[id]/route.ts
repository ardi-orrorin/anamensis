import {NextRequest, NextResponse} from "next/server";
import axios, {AxiosResponse} from "axios";
import {cookies} from "next/headers";
import {BoardI} from "@/app/board/{services}/types";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/boards/' + id;

    const data = await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
        }})
        .then((res: AxiosResponse<BoardI>) => {
            return res.data;
        });

    return new NextResponse(JSON.stringify(data),{
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function PUT(req:NextRequest) {
    const data: BoardI = await req.json();

    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const url = process.env.NEXT_PUBLIC_SERVER + '/api/boards/' + id;
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const result = await axios.put(url, data, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        return res.data;
    });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function DELETE(req:NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const url = process.env.NEXT_PUBLIC_SERVER + '/api/boards/' + id;
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const result = await axios.delete(url, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        return res.data;
    });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}