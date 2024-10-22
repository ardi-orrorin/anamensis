import {NextRequest} from "next/server";
import apiCall from "@/app/{commons}/func/api";
import ExNextResponse from "@/app/{commons}/func/ExNextResponse";
import {ChatSpace} from "@/app/{components}/modal/chats/services/types";

export async function GET(req: NextRequest) {

    const id = req.nextUrl.pathname.split('/')[req.nextUrl.pathname.split('/').length - 1];

    try{
        const data = await apiCall<ChatSpace.ChatMessage[]>({
            path: '/api/chat-messages/chat-room/' + id,
            method: 'GET',
            call: 'Server',
            setAuthorization: true,
            isReturnData: true,
        });

        return ExNextResponse({
            body: JSON.stringify(data),
            status: 200,
            isRoles: false,
        })

    } catch (e: any) {
        return ExNextResponse({
            body: JSON.stringify(e.response.data),
            status: e.response.status,
            isRoles: false,
        })
    }
}