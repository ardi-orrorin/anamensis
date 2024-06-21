import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    try {
        await apiCall<any>({
            path: '/public/api/verify/email',
            method: 'POST',
            body: {email},
            call: 'Server',
        });

        return new NextResponse(null,{
            status: 200,
        });
    } catch (error: any) {
        if(error.response.data.includes('MessageRejectedException')){
            const message = '현재는 등록 가능한 이메일이 제한적이므로 관리자에게 문의해 주시기 바랍니다.';
            return new NextResponse(message,{
                status: 400,
            });
        }

        return new NextResponse(null,{
            status: 400,
        });
    }




}