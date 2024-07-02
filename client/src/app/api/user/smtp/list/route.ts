import apiCall from "@/app/{commons}/func/api";
import {PageResponse} from "@/app/{commons}/types/commons";
import {SmtpCardProps} from "@/app/user/smtp/{components}/SmtpCard";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export async function GET() {

    const result = await apiCall<PageResponse<SmtpCardProps>>({
        path: '/api/user-config-smtp',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true
    })

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
    })
}
