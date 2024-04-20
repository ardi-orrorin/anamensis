import {cookies} from "next/headers";
import axios from "axios";

export async function GET(){
    const url = process.env.NEXT_PUBLIC_SERVER + '/otp/exist';
    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const res = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token?.value
        }
    });

    return new Response(JSON.stringify(res.data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}