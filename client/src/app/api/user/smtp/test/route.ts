import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios from "axios";
import {SmtpI} from "@/app/user/smtp/page";

export async function POST(req: NextRequest) {
    const data = await req.json() as SmtpI;
    const accessToken = cookies().get('accessToken') || cookies().get('refreshToken')

    const url = process.env.NEXT_PUBLIC_SERVER + '/user-config-smtp/test';

    const result = await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken?.value}`
        }
    }).then(res => {
        return res.data;
    }).catch(err => {
        return err;
    });

    return new NextResponse(result, {
        status: 200,
    });

}