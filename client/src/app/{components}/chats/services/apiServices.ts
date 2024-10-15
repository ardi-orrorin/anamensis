import apiCall from "@/app/{commons}/func/api";
import {ChatSpace} from "@/app/{components}/chats/services/types";

const getUserInfoByUserId = async (userId: string) => {
    return await apiCall<ChatSpace.UserInfo>({
        path: '/api/user/info/user/' + userId,
        call: 'Proxy',
        method: 'GET',
        isReturnData: true,
    })
}

const getChatMessagesByChatRoomId = async (chatRoomId: number) => {
    return await apiCall<ChatSpace.ChatMessage[]>({
        call: 'Proxy',
        path: '/api/chat/chatroom/messages/' + chatRoomId,
        method: 'GET',
        isReturnData: true,
    });
}

const chatApiService = {
    getUserInfoByUserId,
    getChatMessagesByChatRoomId,
}

export default chatApiService;