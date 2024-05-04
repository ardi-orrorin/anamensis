import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import EventEmitter from "events";

export async function POST(req: NextRequest) {

    const data = await req.formData();

    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/test';

    const resdata = await axios.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
        }
    })
        .then((res) => {
        return res.data
    })


    return new NextResponse(JSON.stringify(resdata),{
        status: 200
    })
}

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/test';

    const event = new EventSource(url);
    event.onmessage = (e) => {

        const resdata = JSON.parse(e.data)
        return new NextResponse(JSON.stringify(resdata),{
            status: 200
        })
    }
}