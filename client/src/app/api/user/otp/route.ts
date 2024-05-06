import axios from "axios";
import {cookies} from "next/headers";
import {NextRequest} from "next/server";

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/otp';
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');
    console.log(token)
    const res = await axios.get(url,{
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

export async function POST(req: NextRequest) {
    const {otp} = await req.json();

    const url = process.env.NEXT_PUBLIC_SERVER + '/api/otp/verify';

    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const res = await axios.post(url, otp, {
        headers: {
            'Content-Type': 'application/json',
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



export async function PUT(req: NextRequest) {

    console.log('sdfs')
    const url = process.env.NEXT_PUBLIC_SERVER + '/api/otp/disable';
    const token = cookies().get('next.access.token') || cookies().get('next.refresh.token');

    const res = await axios.put(url, {}, {
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