import apiCall from "@/app/{commons}/func/api";
import System from "@/app/user/system/{components}/system";

export interface WebSysI {
    code: string;
    name: string;
    description: string;
    permission: string;
    edit: boolean;
}

export default async function Page(){

    const websys = await apiCall<WebSysI[]>({
        path: `/admin/api/web-sys`,
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    return (
        <>
            <System websys={websys} />
        </>
    )
}

