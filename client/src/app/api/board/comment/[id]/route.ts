import apiCall from "@/app/{commons}/func/api";
import {NextRequest} from "next/server";

export async function DELETE(req: NextRequest){
    const id = req.nextUrl.pathname.split('/')[4];
    const result = await apiCall<boolean>({
        path: '/api/board/comments/' + id,
        method: 'DELETE',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    })

    console.log(result);

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
