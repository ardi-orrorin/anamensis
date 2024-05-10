import {NextRequest, NextResponse} from "next/server";
import axios, {AxiosResponse} from "axios";
import {BoardI} from "@/app/board/[id]/page";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/boards/' + id;

    const data = await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
        }})
        .then((res: AxiosResponse<BoardI>) => {
            return res.data;
        });
    return new NextResponse(JSON.stringify(data),{
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}