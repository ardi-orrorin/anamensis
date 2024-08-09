import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function POST(req: NextRequest)  {
    const { email, code } = await req.json();

    try {

        await apiCall<any>({
            path: '/public/api/verify/verifyCode',
            method: 'POST',
            body: {email, code},
            call: 'Server',
        });

        return new NextResponse(null,{
            status: 200,
        });
    } catch (error) {
        return new NextResponse(null,{
            status: 400,
        });
    }
}