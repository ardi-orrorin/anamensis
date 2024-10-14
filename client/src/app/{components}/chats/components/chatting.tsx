import {useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";
import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import moment from "moment";
import {useEffect, useRef, useState} from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useQuery} from "@tanstack/react-query";

const Chatting = () => {

    const {activeMenu} = useChatMenu();
    const {ws, chatMessages} = useWebSocket();
    const [content, setContent] = useState<string>('');
    const {data: userinfo} = useQuery(userInfoApiService.profile())

    const lastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lastRef.current?.scrollIntoView({behavior: 'instant'});
    }, [chatMessages.createdAt]);

    const submitChatHandler = () => {
        if(!content) return;
        ws.send(JSON.stringify({
            type: ChatSpace.WebSocketResponseType.CHAT,
            routeId: activeMenu.detailId,
            content: content,
            inputting: false,
        }))

        setContent('');
    }

    return (
        <div className={'w-full h-full text-xs flex flex-col overflow-hidden'}>
            <div className={'h-full flex flex-col gap-3 overflow-y-auto'}>
                {
                    Array.from(chatMessages.chatMessages)
                        .filter(chat => chat.chatRoomId === activeMenu.detailId)
                        .map(chat => (
                            <div key={chat.id}
                                 className={`flex ${chat.sender !== userinfo.name ? 'justify-start' : 'justify-end'}`}>
                                <div className={'flex flex-col'}>
                                    <div className={'flex gap-1'}>
                                        <span className={'text-xs'}>{chat.sender}</span>
                                        <span
                                            className={'text-xs'}>{moment(chat.createdAt).format('MM-DD hh:mm')}</span>
                                    </div>
                                    <div className={'bg-gray-200 rounded p-1'}>
                                        {chat.content}
                                    </div>
                                </div>
                            </div>
                        ))
                }
                <div ref={lastRef} className={'h-2'}/>
            </div>
            <div className={'flex gap-1'}>
                <input className={'w-full min-h-8 p-2 rounded border border-solid border-gray-200 outline-0'}
                       value={content}
                       onChange={(e) => setContent(e.target.value)}
                       onKeyUp={(e) => {
                           if (e.key === 'Enter') {
                               submitChatHandler();
                            }
                       }}
                />
                <button className={'min-w-12 bg-gray-700 text-white rounded'}
                        onClick={submitChatHandler}
                >전송</button>
            </div>
        </div>

    )
}


export default Chatting;