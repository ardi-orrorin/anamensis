import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    await apiCall<any>({
        path: '/public/api/verify/email',
        method: 'POST',
        body: {email},
        call: 'Server',
    });

    return new NextResponse(null,{
        status: 200,
    });
}