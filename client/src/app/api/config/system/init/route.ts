import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {AxiosError} from "axios";
import {NextRequest} from "next/server";
import {System} from "@/app/system/{services}/types";

export async function GET(req: NextRequest) {

    const key = req.nextUrl.searchParams.get('key') as System.Key;

    try {
        const result = await apiCall({
            path: '/master/system-settings/init',
            method: 'GET',
            call: 'Server',
            params: {key: key},
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify(result),
            status: 200
        })

    } catch (e) {
        const err = e as AxiosError;

        return ExNextResponse({
            body: err,
            status: err.response?.status ?? 500
        })
    }
}