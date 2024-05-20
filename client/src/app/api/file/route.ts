import {NextRequest, NextResponse} from "next/server";
import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {UserInfoI} from "@/app/user/email/page";



export async function PATCH(req: NextRequest) {
    const data = await req.json();
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/files/content';
    const result = await axios.patch(url, data, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
            'Content-Type': 'application/json'
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