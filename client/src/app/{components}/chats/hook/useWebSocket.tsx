'use client';

import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useQuery} from "@tanstack/react-query";
import {StatusEnum} from "@/app/{components}/chats/services/Status";

export interface WebSocketProviderI {
    ws: WebSocket;
    users: ChatSpace.UserStatus[];
    userInfo: ChatSpace.UserInfo;
    chatList: ChatSpace.ChatListItem[];
    chatMessages: ChatSpace.Chatting;
    changeUserInfoByUsername: (username: string) => void;
    changeStatusHandler: (status: StatusEnum) => void;
    findChatRoomId: (username: string) => void;
}

const WebSocketContext = createContext<WebSocketProviderI>({} as WebSocketProviderI);

export const WebSocketProvider = ({children} : {children: React.ReactNode}) => {

    const [ws, setWs] = useState<WebSocket>({} as WebSocket);
    const [users, setUsers] = useState<ChatSpace.UserStatus[]>([]);
    const [userInfo, setUserInfo] = useState<ChatSpace.UserInfo>({} as ChatSpace.UserInfo);
    const [chatList, setChatList] = useState<ChatSpace.ChatListItem[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatSpace.Chatting>({chatMessages: new Set()} as ChatSpace.Chatting);

    const {data: userinfo} = useQuery(userInfoApiService.profile())

    useEffect(() => {
        const init = () => {
            const newWs = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_SERVER + '/ws/chat/123');
            setWs(newWs);
        }

        init();

        const retry = setInterval(() => {
            if(ws.readyState === ws.OPEN) return;

            ws.close();
            init();
        }, 5000);

        return () => {
            ws.close();
            clearInterval(retry);
        }

    }, []);

    ws.onmessage = (event) => {
        const res = JSON.parse(event.data) as ChatSpace.WebSocketResponse<any>;
        console.log('res', res);

        switch (res?.type) {
            case ChatSpace.WebSocketResponseType.USERS:
                usersHandler(res.data as ChatSpace.UserStatus[]);
                break;
            case ChatSpace.WebSocketResponseType.STATUS:
                statusHandler(res.data as ChatSpace.UserStatus);
                break;
            case ChatSpace.WebSocketResponseType.CHAT:
                chatHandler(res.data as ChatSpace.ChatMessage);
                break;
            case ChatSpace.WebSocketResponseType.CHAT_MESSAGE:
                chatMessageHandler(res as ChatSpace.WebSocketResponse<ChatSpace.ChatMessage[]>);
                break;
            case ChatSpace.WebSocketResponseType.CHATROOM:
                chatRoomHandler(res.data as number);
                break;
            case ChatSpace.WebSocketResponseType.SYSTEM:
                systemHandler(res.data as string);
                break;
            case ChatSpace.WebSocketResponseType.USERINFO:
                userInfoHandler(res.data as ChatSpace.UserInfo);
                break;
            case ChatSpace.WebSocketResponseType.CHATLIST:
                chatListHandler(res.data as ChatSpace.ChatListItem[]);
                break;

            default:
                break;
        }
    }

    const chatMessageHandler = useCallback((res: ChatSpace.WebSocketResponse<ChatSpace.ChatMessage[]>) => {
        res.data.forEach(chat => chatMessages.chatMessages.add(chat));
        setChatMessages({...chatMessages, createdAt: res.createdAt});
    },[chatMessages]);

    const chatListHandler = useCallback((data: ChatSpace.ChatListItem[]) => {
        setChatList(data);
    },[]);

    const chatRoomHandler = useCallback((data: number) => {
        console.log('chatRoom', data);
    },[]);

    const usersHandler = useCallback((data: ChatSpace.UserStatus[]) => {
        data.sort((a, b) => a.username.localeCompare(b.username));
        const findMe = data.findIndex(user => user.username === userinfo.name);

        if(findMe > -1) {
            const me = data.splice(findMe, 1)[0];
            data.unshift(me);
        }

        setUsers(data);
    },[userinfo.name]);

    const userInfoHandler = useCallback((data: ChatSpace.UserInfo) => {
        setUserInfo(data);
    },[]);

    const statusHandler = useCallback((data: ChatSpace.UserStatus) => {
        const newUsers = users.map(user => {
            if(user.username === data.username && user.status !== data.status) {
                user.status = data.status;
            }
            return user;
        });
        setUsers(newUsers);
    },[users]);

    const systemHandler = useCallback((data: string) => {
        console.log('system',data);
    },[]);

    const chatHandler = useCallback((data: ChatSpace.ChatMessage) => {
        chatMessages.chatMessages.add(data);
        setChatMessages({...chatMessages, createdAt: data.createdAt});
    },[chatMessages]);

    const changeUserInfoByUsername = useCallback((username: string) => {
        ws.send(JSON.stringify({
            type: 'USERINFO',
            username
        }));
    },[ws]);


    // fixme: 탭 이동으로 dom 비활성화 시 not a funtction 에러 뜸
    const changeStatusHandler = useCallback((status: StatusEnum) => {
        if(!ws || ws.readyState !== ws.OPEN) return;
        ws?.send(JSON.stringify({
            type: 'STATUS',
            status: status
        }));
    }, []);

    const findChatRoomId = useCallback((username: string) => {
        ws.send(JSON.stringify({
            type: 'CHATROOM',
            username
        }));
    },[ws]);

    return (
        <WebSocketContext.Provider value={{
            ws, users, userInfo, chatList, chatMessages,
            changeUserInfoByUsername, changeStatusHandler,
            findChatRoomId
        }}>
            {children}
        </WebSocketContext.Provider>
    )
}

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);

    if(!context) {
        throw new Error('Cannot find WebSocketProvider');
    }

    return context;
}

