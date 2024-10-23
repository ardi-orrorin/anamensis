import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {AxiosError} from "axios";

export async function GET(req: NextRequest) {

    const params = req.nextUrl.searchParams;

    try {
        const res = await apiCall({
            path: '/master/api/jobs/status',
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
            params,
        });

        return ExNextResponse({
            status: 200,
            body: JSON.stringify(res),
        });
    } catch (e) {
        const err = e as AxiosError;
        return ExNextResponse({
            status: err.response?.status ?? 500,
            body: err.response?.data
        });
    }


}