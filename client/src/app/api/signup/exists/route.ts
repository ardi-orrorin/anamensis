import {NextRequest, NextResponse} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import {SignUp} from "@/app/signup/{services}/types";

export async function POST(req: NextRequest) {

    const body = await req.json() as SignUp.ExistProps;

    try {
        const res = await apiCall<any>({
            path: '/public/api/user/exists',
            method: 'POST',
            body,
            call: 'Server',
            isReturnData: true,
        });


        return new NextResponse(JSON.stringify(res), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify(error),{
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}