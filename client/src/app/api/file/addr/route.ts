import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {UserInfoI} from "@/app/user/email/page";

export async function GET() {
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/files/addr';
    const result = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
            'Content-Type': 'multipart/form-data'
        }
    }).then((res: AxiosResponse<string>) => {
        return res.data;
    })

    return new NextResponse(result, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
