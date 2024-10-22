import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {NextRequest} from "next/server";
import {System} from "@/app/system/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {AxiosError} from "axios";

export async function GET() {

    try {
        const result = await apiCall({
            path: '/master/api/system-settings',
            method: 'GET',
            call: 'Server',
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

export async function PUT(req: NextRequest) {
    const body = await req.json() as System.Request<any>;

    const result = await apiCall<boolean, System.Request<any>>({
        path: '/master/api/system-settings',
        method: 'PUT',
        call: 'Server',
        setAuthorization: true,
        body,
        isReturnData: true,
    });

    return ExNextResponse({
        body: JSON.stringify({result}),
        status: 200
    })
}