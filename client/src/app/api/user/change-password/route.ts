import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {AxiosError} from "axios";
import {ChangePasswordI} from "@/app/user/info/change-password/{services}/passwordProvider";
import {StatusResponse} from "@/app/{commons}/types/commons";

export async function POST(req: NextRequest) {
    const body = await req.json() as ChangePasswordI;

    try {
        const res = await apiCall<StatusResponse, ChangePasswordI>({
            path: '/api/user/change-password',
            method: 'POST',
            call: 'Server',
            body,
            setAuthorization: true,
            isReturnData: true,
        })

        return ExNextResponse({
            body: JSON.stringify(res),
            status: 200,
        })

    } catch (e) {
        const err = e as AxiosError;

        console.log(err)
        return ExNextResponse({
            body: JSON.stringify(err.response?.data),
            status: err.response?.status || 500,
        })
    }

}