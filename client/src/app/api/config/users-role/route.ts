import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import apiCall from "@/app/{commons}/func/api";
import {UsersRole} from "@/app/system/users-role/page";
import {NextRequest} from "next/server";
import axios, {AxiosError} from "axios";

export async function GET(req: NextRequest){

    const params = req.nextUrl.searchParams;

    try {
        const res = await apiCall<UsersRole>({
            path : '/master/api/user/list',
            method : 'GET',
            params,
            call: 'Server',
            setAuthorization: true,
            isReturnData: true
        })

        return ExNextResponse({
            body: JSON.stringify(res),
            status: 200,
        })

    } catch (e : any) {
        const error= (e as AxiosError);
        return ExNextResponse({
            body: JSON.stringify(error?.response?.data),
            status: Number(error?.response?.status || 500),
        })
    }
}

export async function PUT(req: NextRequest) {

    const body = await req.json();

    try {
        const res = await apiCall({
            path : '/master/api/user/role',
            method : 'PUT',
            body: body,
            call: 'Server',
            setAuthorization: true,
            isReturnData: true
        })

        return ExNextResponse({
            body: JSON.stringify(res),
            status: 200,
        })

    } catch (e : any) {
        const error= (e as AxiosError);
        return ExNextResponse({
            body: JSON.stringify(error?.response?.data),
            status: Number(error?.response?.status || 500),
        })
    }
}