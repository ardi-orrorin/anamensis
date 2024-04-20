import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const { email } = await req.json();
    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/verify/email';

    const res = await axios.post(url, {email}, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return new NextResponse(null,{
        status: 200,
    });
}