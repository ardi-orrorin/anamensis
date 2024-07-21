import {NextRequest} from "next/server";
import {RefBoardI} from "@/app/board/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {cookies} from "next/headers";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const getCookies = (cookies().get('next.access.token') || cookies().get('next.refresh.token'))?.value !== undefined;

    try{
       const data = await apiCall<RefBoardI>({
            path: '/public/api/boards/ref/' + id,
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify({...data, isLogin: getCookies}),
            status: 200,
        })
    } catch (e: any) {
        return ExNextResponse({
            body: JSON.stringify(e.response.data),
            status: e.response.status,
        })
    }
}