import apiCall from "@/app/{commons}/func/api";
import {NextRequest} from "next/server";
import {PageResponse} from "@/app/{commons}/types/commons";
import {CommentI} from "@/app/board/{services}/types";

export async function DELETE(req: NextRequest){
    const id = req.nextUrl.pathname.split('/')[4];

    const result = await apiCall<PageResponse<CommentI>>({
        path: '/api/board/comments/' + id,
        method: 'DELETE',
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
