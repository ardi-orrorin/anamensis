'use client';

import {faCommentDots} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useEffect, useState} from "react";

const Chat = () => {

    const [ws, setWs] = useState<WebSocket | null>(null);

    const [messages, setMessages] = useState<SocketMessage[]>([]);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080/ws/chat/123');

        ws.onopen = () => {
            console.log('connected');
        }

        ws.onclose = () => {
            console.log('disconnected');
        }

        setWs(ws);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data) as SocketMessage;
            setMessages([...messages, message]);
        }

        return () => {
            ws.close();
        }
    }, []);



    return (
        <div>
            <button
                className={'fixed z-[400] left-5 bottom-5 w-14 h-14 flex justify-center items-center drop-shadow-md shadow-black bg-white rounded-full'}
            >
                <FontAwesomeIcon icon={faCommentDots} size={'xl'} />
            </button>
        </div>
    )
}

export default Chat;