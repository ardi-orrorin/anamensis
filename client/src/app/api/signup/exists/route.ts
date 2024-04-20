import {ExistProps} from "@/app/signup/page";
import axios from "axios";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {

    const data = await req.json() as ExistProps;

    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/exists';

    try {
        const res = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return new NextResponse(JSON.stringify(res.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify(error),{
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}