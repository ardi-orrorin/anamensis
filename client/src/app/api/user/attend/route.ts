import {cookies} from "next/headers";
import axios, {AxiosResponse} from "axios";
import {NextResponse} from "next/server";
import {AttendInfoI} from "@/app/user/{components}/AttendInfo";

export async function GET(){
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/attendance';

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const result: string = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
        }
    })
        .then((res: AxiosResponse<AttendInfoI>) => {
            return res.data;
        })
        .catch(err => {
            return err.response.data.message;
        });



    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}