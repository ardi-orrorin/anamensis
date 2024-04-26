import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const {username, password} = await req.json();
    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/login';

    const res = await axios.post(url, {username, password}, {
        headers: {
            'Content-Type': 'application/json',
        }
    })

    return new NextResponse(JSON.stringify(res.data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}