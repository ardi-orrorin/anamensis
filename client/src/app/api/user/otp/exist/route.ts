import {cookies} from "next/headers";
import axios from "axios";

export async function GET(){
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/otp/exist';
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

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