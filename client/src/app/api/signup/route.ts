import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {SignUp} from "@/app/signup/{services}/types";

export async function POST(req: NextRequest) {

    const response = await apiCall<SignUp.UserProps>({
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