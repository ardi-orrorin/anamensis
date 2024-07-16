import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {PageResponse} from "@/app/{commons}/types/commons";
import {BoardListI} from "@/app/{components}/boardComponent";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {BoardListParamsI} from "@/app/{services}/SearchParamsProvider";

export async function GET(req: NextRequest) {
    const searchParams = new URLSearchParams(req.nextUrl.searchParams);
    const { page, size
        , type, value, categoryPk
        , isSelf, isFavorite
    } = Object.fromEntries(searchParams.entries()) as BoardListParamsI;
    const params = {
        page,
        size,
        type,
        value,
        categoryPk,
        isFavorite,
        isSelf : Boolean(isSelf),
    }

    const result = await apiCall<PageResponse<BoardListI>, URLSearchParams>({
        path: '/public/api/boards',
        method: 'GET',
        params,
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
        isRoles: String(page) === '1',
    })
}