import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import apiCall from "@/app/{commons}/func/api";
import {SystemPoint} from "@/app/system/point/{services}/types";
import {AxiosError} from "axios";
import {NextRequest} from "next/server";
import {Common} from "@/app/{commons}/types/commons";
import StatusResponse = Common.StatusResponse;

export async function GET() {

    try {
        const res = await apiCall<SystemPoint.Point[]>({
            path: '/master/points',
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
        const message = err.status == 403 ? '권한이 없습니다.' : '서버 오류입니다.';
        return ExNextResponse({
            body: JSON.stringify({message}),
            status: err.status || 500,
        })
    }
}

export async function PUT(req: NextRequest) {
    const body = await req.json() as SystemPoint.Point[];

    try {
        const res = await apiCall<StatusResponse, SystemPoint.Point[]>({
            path: '/master/points',
            method: 'PUT',
            call: 'Server',
            body,
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify(res),
            status: 200,
        });
    } catch (e) {
        const err = e as AxiosError;
        const message = err.status == 403 ? '권한이 없습니다.' : '서버 오류입니다.';
        return ExNextResponse({
            body: JSON.stringify({message}),
            status: err.status || 500,
        })
    }
}

