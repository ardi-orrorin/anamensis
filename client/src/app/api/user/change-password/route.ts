import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {AxiosError} from "axios";
import {Common} from "@/app/{commons}/types/commons";
import {UserInfoSpace} from "@/app/user/info/{services}/types";

export async function POST(req: NextRequest) {
    const body = await req.json() as UserInfoSpace.ChangePassword;

    try {
        const res = await apiCall<Common.StatusResponse, UserInfoSpace.ChangePassword>({
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