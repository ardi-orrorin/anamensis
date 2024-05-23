import {cookies} from "next/headers";
import axios from "axios";

export async function GET(){

    const url = process.env.NEXT_PUBLIC_SERVER + '/api/boards/summary';
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const result = await axios.get(url, {
        headers: {
            'Authorization': 'Bearer ' + token?.value,
            'Content-Type': 'application/json',
        }
    }).then((res) => {
        return res.data;
    });

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}