import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function GET(req:NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if(!url) return new NextResponse(null, {status: 400});

    try {
        const result = await axios.get(url);
        return new NextResponse(result.data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
        });
    } catch (e) {
        return new NextResponse('', {status: 404});
    }
}