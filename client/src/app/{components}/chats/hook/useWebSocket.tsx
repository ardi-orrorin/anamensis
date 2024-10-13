'use client';

import {createContext, useContext, useEffect, useState} from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";

export interface WEbSocketProviderI {
    ws: WebSocket;
    users: ChatSpace.UserStatus[];
}

const WebSocketContext = createContext<WEbSocketProviderI>({} as WEbSocketProviderI);

export const WebSocketProvider = ({children} : {children: React.ReactNode}) => {

    const [ws, setWs] = useState<WebSocket>({} as WebSocket);
    const [users, setUsers] = useState<ChatSpace.UserStatus[]>([]);

    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_SERVER + '/ws/chat/123');

        ws.onopen = () => {
            console.log('connected');
        }

        ws.onclose = () => {
            console.log('disconnected');
        }


        ws.onmessage = (event) => {
            const res = JSON.parse(event.data) as ChatSpace.WebSocketResponse<any>;
            console.log('res', res);

            if(res?.type === 'USERS') {
                const data = res.data as ChatSpace.UserStatus[];
                setUsers(data);

                console.log('users', res);
            }

            if (res?.type === 'STATUS') {
                const data = res.data as ChatSpace.UserStatus;
                statusHandler(data);
            }

            if (res?.type === 'CHAT') {
                const data = res.data as ChatSpace.ChatMessage;
                chatHandler(data);
            }

            if (res?.type === 'SYSTEM') {
                const data = res.data as string;
                systemHandler(data);
            }
        }

        setWs(ws);

        return () => {
            ws.close();
        }

    }, []);

    const statusHandler = (data: ChatSpace.UserStatus) => {
        const newUsers = users.map(user => {
            if(user.username === data.username) {
                if(user.status !== data.status) {
                    user.status = data.status;
                }
            }
            return user;
        });

        console.log(newUsers);
        setUsers(newUsers);
    }

    const systemHandler = (data: string) => {
        console.log('system',data);
    }

    const chatHandler = (data: ChatSpace.ChatMessage) => {
        console.log('chat', data);
    }

    return (
        <WebSocketContext.Provider value={{ ws, users }}>
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

