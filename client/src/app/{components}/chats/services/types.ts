import {StatusEnum} from "@/app/{components}/chats/services/Status";

interface WebSocketResponseI<T> {
    type     : ChatSpace.WebSocketResponseType;
    data     : T;
    createdAt : string;
}

interface ChatMessageI {
    id         : number;
    chatRoomId : number;
    sender     : string;
    content    : string;
    inputting  : boolean;
    completed  : boolean;
    createdAt  : string;
}

interface ChattingI {
    chatRoomId  : number;
    createdAt   : string;
    chatMessages: Set<ChatMessageI>;
}

interface UserStatusI {
    id           : number;
    username     : string;
    status       : StatusEnum;
    profileImage : string;
}

interface UserInfoI {
    id           : number;
    userId       : string;
    email        : string;
    name         : string;
    phone        : string;
    point        : string;
    profileImage : string;
}

interface ChatListItemI {
    id          : number;
    name        : string;
    type        : string;
    lastMessage : string;
    users       : UserI[];
    updatedAt   : string;
    unreadCount : number;
}

interface UserI {
    id           : number;
    name         : string;
    userId       : string;
    profileImage : string;
}

export namespace ChatSpace {
    export type WebSocketResponse<T>  = WebSocketResponseI<T>;
    export type ChatMessage           = ChatMessageI;
    export type UserStatus            = UserStatusI;
    export type UserInfo              = UserInfoI;
    export type ChatListItem          = ChatListItemI;
    export type Chatting              = ChattingI;
    export enum WebSocketResponseType {
        CHAT            = 'CHAT',
        CHAT_MESSAGE    = 'CHAT_MESSAGE',
        CHATROOM        = 'CHATROOM',
        STATUS          = 'STATUS',
        SYSTEM          = 'SYSTEM',
        ERROR           = 'ERROR',
        USERS           = 'USERS',
        USERINFO        = 'USERINFO',
        CHATLIST        = 'CHATLIST',
    }
}