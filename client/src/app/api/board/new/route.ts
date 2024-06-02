import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import {BoardI} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";

export async function POST(req: NextRequest){
    const data: BoardI = await req.json();
    const result = await apiCall<any>({
        path: '/api/boards',
        method: 'POST',
        body: data,
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}