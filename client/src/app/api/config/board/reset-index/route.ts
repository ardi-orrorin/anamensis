import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import apiCall from "@/app/{commons}/func/api";
import {SystemPoint} from "@/app/system/point/{services}/types";
import {AxiosError} from "axios";
import {NextRequest} from "next/server";
import {Common} from "@/app/{commons}/types/commons";
import StatusResponse = Common.StatusResponse;

export async function GET() {

    try {
        const res = await apiCall<StatusResponse>({
            path: '/master/api/jobs/reset-board-index',
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify(res),
            status: 200,
        });

    } catch (e) {
        const err = e as AxiosError;
        return ExNextResponse({
            body: JSON.stringify(err.response?.data),
            status: err.status ?? 500,
        })
    }
}