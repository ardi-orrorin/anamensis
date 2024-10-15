'use client';

import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useQuery} from "@tanstack/react-query";
import {StatusEnum} from "@/app/{components}/chats/services/Status";
import chatApiService from "@/app/{components}/chats/services/apiServices";
import WebSocketResponseType = ChatSpace.WebSocketResponseType;
import ChatListItem = ChatSpace.ChatListItem;
import WebSocketResponse = ChatSpace.WebSocketResponse;
import ChatMessage = ChatSpace.ChatMessage;
import UserStatus = ChatSpace.UserStatus;
import UserInfo = ChatSpace.UserInfo;
import Chatting = ChatSpace.Chatting;

export interface WebSocketProviderI {
    ws: WebSocket;
    users: ChatSpace.UserStatus[];
    userInfo: ChatSpace.UserInfo;
    chatList: ChatSpace.ChatListItem[];
    chatMessages: ChatSpace.Chatting[];
    changeStatusHandler: (status: StatusEnum) => void;
    findChatMessageByChatRoomId: (chatRoomId: number) => ChatSpace.Chatting | undefined;
    userInfoHandler: (userId: string) => Promise<void>;
    initUnreadCount: (chatRoomId: number) => void;
}

const WebSocketContext = createContext<WebSocketProviderI>({} as WebSocketProviderI);

export const WebSocketProvider = ({children} : {children: React.ReactNode}) => {

    const [ws, setWs] = useState<WebSocket>({} as WebSocket);
    const [users, setUsers] = useState<ChatSpace.UserStatus[]>([]);
    const [userInfo, setUserInfo] = useState<UserInfo>({} as UserInfo);
    const [chatList, setChatList] = useState<ChatListItem[]>([]);
    const [chatMessages, setChatMessages] = useState<Chatting[]>([]);

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
        const res = JSON.parse(event.data) as WebSocketResponse<any>;
        console.log('res', res);

        switch (res?.type as WebSocketResponseType) {
            case WebSocketResponseType.USERS:
                usersHandler(res.data as UserStatus[]);
                break;
            case WebSocketResponseType.STATUS:
                statusHandler(res.data as UserStatus);
                break;
            case WebSocketResponseType.CHAT:
                chatHandler(res.data as ChatMessage);
                break;
            case WebSocketResponseType.CHAT_MESSAGE:
                chatMessageHandler(res as WebSocketResponse<ChatMessage[]>);
                break;
            case WebSocketResponseType.SYSTEM:
                systemHandler(res.data as string);
                break;
            case WebSocketResponseType.CHATLIST:
                chatListHandler(res.data as ChatListItem[]);
                break;

            default:
                break;
        }
    }

    const chatMessageHandler = useCallback((res: WebSocketResponse<ChatMessage[]>) => {
        const findChat = chatMessages.find(chat => chat.chatRoomId === res.data[0].chatRoomId)
            ?? {chatRoomId: res.data[0].chatRoomId, createdAt: res.createdAt, chatMessages: new Set<ChatSpace.ChatMessage>()};

        res.data.forEach(chat => findChat.chatMessages.add(chat));

        setChatMessages([...chatMessages.filter(chat => chat.chatRoomId !== res.data[0].chatRoomId), findChat]);
    },[chatMessages]);

    const chatListHandler = useCallback((data: ChatListItem[]) => {
        const reform = data.map(chat => {
            const prevUnreadCount = chatList.find(prevChat => chat.id === prevChat.id)?.unreadCount;
            return {...chat, unreadCount: prevUnreadCount ?? 0};
        });

        setChatList(reform);
    },[chatList]);

    const usersHandler = useCallback((data: UserStatus[]) => {
        data.sort((a, b) => a.username.localeCompare(b.username));
        const findMe = data.findIndex(user => user.username === userinfo.name);

        if(findMe > -1) {
            const me = data.splice(findMe, 1)[0];
            data.unshift(me);
        }

        setUsers(data);
    },[userinfo.name]);

    const userInfoHandler = useCallback(async (userId: string) => {
        return chatApiService.getUserInfoByUserId(userId)
            .then(data => setUserInfo(data));
    },[]);

    const statusHandler = useCallback((data: UserStatus) => {
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

    const chatHandler = useCallback((data: ChatMessage) => {
        const updateChat = {
            ...chatMessages.find(chat => chat.chatRoomId === data.chatRoomId),
            createdAt: data.createdAt,
        } as Chatting;

        const findChatList = chatList.find(chat => chat.id === data.chatRoomId);

        if(!findChatList) Error('Cannot find chatList');

        const unreadCount = data.sender === userinfo.userId
            ? findChatList!!.unreadCount
            : findChatList!!.unreadCount + 1

        const updateFindChat = { ...findChatList, unreadCount } as ChatListItem;

        setChatList([...chatList.filter(chat => chat.id !== data.chatRoomId), updateFindChat]);

        if(updateChat.chatMessages) {
            updateChat.chatMessages.add(data);
            setChatMessages([...chatMessages.filter(chat => chat.chatRoomId !== data.chatRoomId), updateChat]);
            return;
        }

        updateChat.chatMessages = new Set<ChatMessage>();

        return chatApiService.getChatMessagesByChatRoomId(data.chatRoomId)
            .then(res => {
                res.forEach(chat => updateChat.chatMessages.add(chat));
                setChatMessages([...chatMessages.filter(chat => chat.chatRoomId !== data.chatRoomId), updateChat]);
            });

    },[chatMessages, chatList]);

    const changeStatusHandler = useCallback((status: StatusEnum) => {
        ws.send(JSON.stringify({
            type: 'STATUS',
            status: status
        }));
    }, [ws]);

    const findChatMessageByChatRoomId = useCallback((chatRoomId: number) => {
        return chatMessages.find(chat => chat.chatRoomId === chatRoomId);
    },[chatMessages]);

    const initUnreadCount = useCallback((chatRoomId: number) => {
        const chatRoom = chatList.find(chat => chat.id === chatRoomId);
        const updateChatRoom = {...chatRoom, unreadCount: 0} as ChatListItem;
        setChatList([...chatList.filter(chat => chat.id !== chatRoomId), updateChatRoom]);
    },[chatList]);

    return (
        <WebSocketContext.Provider value={{
            ws, users, userInfo, chatList, chatMessages,
            changeStatusHandler, userInfoHandler,
            findChatMessageByChatRoomId, initUnreadCount
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

