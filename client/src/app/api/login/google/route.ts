import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
    const {secret, response} = await req.json();
    const url = 'https://www.google.com/recaptcha/api/siteverify';
    const data = {secret, response};

    const resData = await axios.post(url, data,{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then((res) => {
        return res.data;
    })

    return new NextResponse(JSON.stringify(resData), {
        status: 200
    })
}