import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import axios from "axios";
import {BoardI} from "@/app/board/{services}/types";

export async function POST(req: NextRequest){
    const data: BoardI = await req.json();

    const url = process.env.NEXT_PUBLIC_SERVER + '/api/boards';
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const result = await axios.post(url, data, {
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