import {cookies} from "next/headers";
import axios, {AxiosError, AxiosResponse} from "axios";
import {NextResponse} from "next/server";

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/attendance/check';

    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const result: string = await axios.get(url, {
            headers: {
                'Authorization': 'Bearer ' + token?.value,
            }
        })
        .then((res: AxiosResponse<string>) => {
            return res.data;
        })
        .catch(err => {
            return err.response.data.message;
        });

    return new NextResponse(result, {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });

}