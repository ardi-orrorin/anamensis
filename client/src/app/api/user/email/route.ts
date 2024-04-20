import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {AuthPropsI, UserInfoI} from "@/app/user/email/page";
import {NextRequest, NextResponse} from "next/server";

export async function GET(){
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/user/info';
    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const result = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
        }
    }).then((res: AxiosResponse<UserInfoI>) => {
        return res.data;
    });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function PUT(req: NextRequest) {
    const {sauth, sauthType} = await req.json() as AuthPropsI;

    const url = process.env.NEXT_PUBLIC_SERVER + '/api/user/s-auth';

    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const result = await axios.put(url, {sauth, sauthType}, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
            'Content-Type': 'application/json'
        },
    }).then((res ) => {
        return res.data;
    })

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}