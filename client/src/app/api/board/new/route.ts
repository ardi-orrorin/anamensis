import {NextRequest} from "next/server";
import {BoardI} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {AxiosError} from "axios";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
export async function POST(req: NextRequest){
    const data: BoardI = await req.json();

    try {
        const result = await apiCall<any, BoardI>({
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
    } catch (e: any) {
        const err = e as AxiosError;
        return ExNextResponse({
            body: JSON.stringify(err.response?.data),
            status: err.response?.status || 500,
            isRoles: false,
        });
    }



}