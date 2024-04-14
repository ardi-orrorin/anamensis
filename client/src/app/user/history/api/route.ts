import axios from "axios";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    const url = process.env.NEXT_PUBLIC_SERVER + '/user/histories';
    const response = await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies().get('accessToken')?.value}`
    }});

    return NextResponse.json(response.data);
}

