import {NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {cookies} from "next/headers";

type ExNextResponseType = {
    body: any,
    status: number,
    headers?: Headers,
    contentType?: string,
    isRoles?: boolean,
}

const ExNextResponse = async (props: ExNextResponseType): Promise<NextResponse> =>  {
    const headers = props.headers || new Headers();

    const status = props.status || 200;

    const body = props.body || '';

    if(!headers.has('Content-Type')) {
        headers.append('Content-Type', 'application/json');
    }

    if(props.isRoles && cookies().get('next.access.token')?.value) {
        const res = await apiCall({
            path: '/api/user/roles',
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        headers.append('next.user.roles',  JSON.stringify(res));
    }

    return new NextResponse(body, {
        status,
        headers,
    });
}

export default ExNextResponse;