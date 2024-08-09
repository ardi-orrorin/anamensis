import {AxiosError} from "axios";
import apiCall from "@/app/{commons}/func/api";
import {Root} from "@/app/{services}/types";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export async function GET() {

    try {
        const res = await apiCall<Root.ScheduleAlert[]>({
            method: 'GET',
            path: '/api/schedule-alert',
            call: 'Server',
            isReturnData: true,
            setAuthorization: true
        });

        return ExNextResponse({
            body: JSON.stringify(res),
            status: 200,
        })

    } catch (e) {
        const err = e as AxiosError;

        return ExNextResponse({
            body: JSON.stringify(err.response?.data),
            status: err.response?.status || 500,
        })
    }

}