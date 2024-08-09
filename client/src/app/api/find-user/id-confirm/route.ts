import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";

export async function POST(req: NextRequest){
    const body  = await req.json() as User.FindUser;

    const result = await apiCall<boolean, User.FindUser>({
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