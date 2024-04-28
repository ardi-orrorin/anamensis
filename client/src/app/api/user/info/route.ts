import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {UserInfoI} from "@/app/user/email/page";
import {NextResponse} from "next/server";

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/user/info';

    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const result = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
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