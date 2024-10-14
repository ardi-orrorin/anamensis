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
    id         : number;
    name       : string;
    type       : string;
    lastMessage: string;
    userCount  : number;
    updatedAt  : string;
}

export namespace ChatSpace {
    export type WebSocketResponse<T>  = WebSocketResponseI<T>;
    export type ChatMessage           = ChatMessageI;
    export type UserStatus            = UserStatusI;
    export type UserInfo              = UserInfoI;
    export type ChatListItem         = ChatListItemI;
    export enum WebSocketResponseType {
        CHAT        = 'CHAT',
        CHATROOM    = 'CHATROOM',
        STATUS      = 'STATUS',
        SYSTEM      = 'SYSTEM',
        ERROR       = 'ERROR',
        USERS       = 'USERS',
        USERINFO    = 'USERINFO',
        CHATLIST    = 'CHATLIST',
    }
}