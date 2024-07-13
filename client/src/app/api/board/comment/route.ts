import {NextRequest} from "next/server";
import {cookies} from "next/headers";
import apiCall from "@/app/{commons}/func/api";
import {SaveComment} from "@/app/board/[id]/{components}/comment";
import {CommentI} from "@/app/board/{services}/types";


export async function GET(req: NextRequest){
    const boardPk = req.nextUrl.searchParams.get('boardPk')!;
    const searchParams = req.nextUrl.searchParams;

    const result = await apiCall<CommentI[]>({
        path: '/public/api/board/comments',
        method: 'GET',
        params: {boardPk: boardPk as string, page: searchParams.get('page') || 1, size: searchParams.get('size') || 10},
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function POST(req: NextRequest){

    const token = (cookies().get('next.access.token') || cookies().get('next.refresh.token'))?.value;
    if(!token){
        return new Response(JSON.stringify({message: '로그인이 필요합니다.'}), {
            status: 401,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    const body: SaveComment = await req.json();

    const result = await apiCall<boolean, SaveComment>({
        path: '/api/board/comments',
        method: 'POST',
        body,
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}