import {NextRequest, NextResponse} from "next/server";
import {UserInfoI} from "@/app/user/email/page";
import apiCall from "@/app/{commons}/func/api";

export async function POST(req: NextRequest) {
    const body = await req.formData();

    console.log(body)

    const result = await apiCall<UserInfoI>({
        path: '/api/files/content-img',
        method: 'POST',
        call: 'Server',
        contentType: 'multipart/form-data',
        setAuthorization: true,
        isReturnData: true,
        body,
    });



    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
