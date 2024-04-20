import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {UserProps} from "@/app/signup/page";

export async function POST(req: NextRequest) {

    const data = await req.json() as UserProps;

    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/signup';

    const response = await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.data;
    });

    return new NextResponse(JSON.stringify(response), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}