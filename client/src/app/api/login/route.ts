import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const {username, password} = await req.json();
    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/login';

    const res = await axios.post(url, {username, password})
        .then(res => {
            return {
                status: res.status,
                body: res.data
            }
        }).catch(err => {
            return {
                status: err.response.status,
                body: err.response.data
            }
        });

    return new NextResponse(JSON.stringify(res.body), {
        status: res.status
    });
}