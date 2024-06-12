import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {FindUser} from "@/app/reset-pwd/{services}/type";

export async function POST(req: NextRequest){
    const body: FindUser  = await req.json();

    const result = await apiCall<boolean, FindUser>({
        path: '/public/api/user/find-id-email-confirm',
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