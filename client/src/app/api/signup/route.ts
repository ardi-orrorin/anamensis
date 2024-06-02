import {NextRequest, NextResponse} from "next/server";
import {UserProps} from "@/app/signup/page";
import apiCall from "@/app/{commons}/func/api";

export async function POST(req: NextRequest) {

    const response = await apiCall<UserProps>({
        path: '/public/api/user/signup',
        method: 'POST',
        body: await req.json(),
        call: 'Server',
        isReturnData: true,
    });

    return new NextResponse(JSON.stringify(response), {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}