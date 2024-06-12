import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {ResetPwdI, ResetPwdResponse} from "@/app/reset-pwd/page";

export async function POST(req: NextRequest){
    const body: ResetPwdI  = await req.json();
    console.log(body)

    const result = await apiCall<ResetPwdResponse, ResetPwdI>({
        path: '/public/api/user/reset-password',
        method: 'POST',
        body,
        call: 'Server',
        isReturnData: true,
    })



    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}