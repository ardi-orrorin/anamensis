import apiCall from "@/app/{commons}/func/api";
import {PointSummaryI} from "@/app/user/{components}/PointSummary";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest){
    const params = new URLSearchParams(req.nextUrl.searchParams);

    const result = await apiCall<PointSummaryI[]>({
        path: '/api/point-histories/summary',
        method: 'GET',
        params,
        call: 'Server',
        setAuthorization: true,
        isReturnData: true
    })

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}