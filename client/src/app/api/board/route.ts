import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {PageResponse} from "@/app/{commons}/types/commons";
import {BoardListI} from "@/app/{components}/boardComponent";
import {cookies, headers} from "next/headers";

export async function GET(req: NextRequest) {

    const searchParams = new URLSearchParams(req.nextUrl.searchParams);
    const { page, size, type, value, categoryPk } = Object.fromEntries(searchParams.entries());
    const params = {
        page,
        size,
        categoryPk,
        [type]: value
    }

    const result = await apiCall<PageResponse<BoardListI>, URLSearchParams>({
        path: '/public/api/boards',
        method: 'GET',
        params,
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'roles': cookies().get('next.user')?.value || ''
        }
    });
}