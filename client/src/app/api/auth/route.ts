import {NextResponse} from "next/server";

export async function GET() {

    return NextResponse.redirect('http://localhost:8080/oauth2/authorization/google');
}