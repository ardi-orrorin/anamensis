import apiCall from "@/app/{commons}/func/api";
import {PointSummaryI} from "@/app/user/{components}/PointSummary";

export async function GET(){
    const result = await apiCall<PointSummaryI[]>({
        path: '/api/point-histories/summary',
        method: 'GET',
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