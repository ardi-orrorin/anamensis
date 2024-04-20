import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const { email, code } = await req.json();
    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/verify/verifyCode';

    try {
        const res = await axios.post(url, {email, code}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return new NextResponse(null,{
            status: 200,
        });
    } catch (error) {
        return new NextResponse(null,{
            status: 400,
        });
    }
}