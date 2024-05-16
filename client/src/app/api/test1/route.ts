import {NextResponse} from "next/server";

export async function GET(){
    console.log('GET')

    return new NextResponse(JSON.stringify({data: 'GET'}),{
        status: 200
    });
}