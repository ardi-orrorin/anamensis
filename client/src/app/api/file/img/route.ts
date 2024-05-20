import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {UserInfoI} from "@/app/user/email/page";

export async function POST(req: NextRequest) {
    const data = await req.formData();

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/files/content-img';
    const result = await axios.post(url, data, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
            'Content-Type': 'multipart/form-data'
        }
    }).then((res: AxiosResponse<UserInfoI>) => {
        return res.data;
    })

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
