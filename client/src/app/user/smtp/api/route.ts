import {NextRequest, NextResponse} from "next/server";
import {SmtpI} from "@/app/user/smtp/page";
import {cookies} from "next/headers";
import axios from "axios";

export async function GET() {

    const token = cookies().get('accessToken') || cookies().get('refreshToken')

    const url = process.env.NEXT_PUBLIC_SERVER + '/user-config-smtp';

    const result: SmtpI = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token?.value}`
            }
        })
        .then(res => {
            return res.data;
        });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function POST(req: NextRequest) {

    const data = await req.json() as SmtpI;
    const token = cookies().get('accessToken') || cookies().get('refreshToken')

    const url = process.env.NEXT_PUBLIC_SERVER + '/user-config-smtp';

    const result: SmtpI  = await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token?.value}`
        }})
        .then(res => {
            return res.data;
        });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}