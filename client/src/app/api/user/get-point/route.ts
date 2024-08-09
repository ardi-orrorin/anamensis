import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {User} from "@/app/login/{services}/types";

export async function GET() {
    const result = await apiCall<User.UserInfo>({
        path: '/api/user/get-point',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return ExNextResponse({
        body: JSON.stringify(result),
        status: 200,
    })
}
