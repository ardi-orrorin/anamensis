import {StatusEnum} from "@/app/{components}/chats/services/Status";

interface WebSocketResponseI<T> {
    type     : ChatSpace.WebSocketResponseType;
    data     : T;
    createdAt : string;
}

enum WebSocketResponseTypeEnum {
    CHAT   = 'CHAT',
    STATUS = 'STATUS',
    SYSTEM = 'SYSTEM',
    ERROR  = 'ERROR',
    USERS  = 'USERS',
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
    username     : number;
    status       : StatusEnum;
    profileImage : string;
}

export namespace ChatSpace {
    export type WebSocketResponse<T>  = WebSocketResponseI<T>;
    export type ChatMessage           = ChatMessageI;
    export type WebSocketResponseType = WebSocketResponseTypeEnum;
    export type UserStatus            = UserStatusI;
}