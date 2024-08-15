import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import apiCall from "@/app/{commons}/func/api";

// export function GET(){
//     return ExNextResponse({
//         body: '',
//         status: 200,
//         isRoles: true,
//     })
// }
export async function GET(){
    const res = await apiCall({
        path: '/api/user/roles',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return ExNextResponse({
        body: JSON.stringify(res),
        status: 200,
        isRoles: true,
    })
}