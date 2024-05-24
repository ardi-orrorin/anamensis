import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios from "axios";

export async function DELETE(req: NextRequest) {

    const id = req.nextUrl.pathname.split('/')[4];

    const url = process.env.NEXT_PUBLIC_SERVER + '/admin/api/web-sys/code/' + id;

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const res = await axios.delete(url, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }
    });

    return new NextResponse(null, {
        status: 200,
    });
}