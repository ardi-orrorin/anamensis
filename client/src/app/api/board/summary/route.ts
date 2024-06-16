import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {BoardSummaryI} from "@/app/user/{components}/BoardSummary";

export async function GET(req: NextRequest){
    const params = new URLSearchParams(req.nextUrl.searchParams);

    const result = await apiCall<BoardSummaryI[]>({
        path: '/api/boards/summary',
        method: 'GET',
        params,
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}