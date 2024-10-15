import {useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";
import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import moment from "moment";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useQuery} from "@tanstack/react-query";

const Chatting = () => {

    const {activeMenu} = useChatMenu();
    const {ws, chatMessages, findChatMessageByChatRoomId} = useWebSocket();
    const [content, setContent] = useState<string>('');
    const {data: userinfo} = useQuery(userInfoApiService.profile())

    const lastRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lastRef.current?.scrollIntoView({behavior: 'instant'});
    }, [chatMessages]);


    const submitHotKeyHandler = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.key === 'Enter' && e.shiftKey) {
            e.preventDefault();
            submitChatHandler();
        }
    },[content]);

    const submitChatHandler = useCallback(() => {
        if(!content) return;
        ws.send(JSON.stringify({
            type: ChatSpace.WebSocketResponseType.CHAT,
            routeId: activeMenu.detailId,
            content: content,
            inputting: false,
        }))

        setContent('');
    },[content, ws, activeMenu.detailId]);


    return (
        <div className={'w-full h-full text-xs flex flex-col overflow-hidden'}>
            <div className={'h-full flex flex-col gap-3 overflow-y-auto'}>
                {
                    Array.from(findChatMessageByChatRoomId(activeMenu.detailId)?.chatMessages || [])
                        .filter(chat => chat.chatRoomId === activeMenu.detailId)
                        .map(chat => (
                            <div key={`chat-${chat.chatRoomId}-message-${chat.id}-chat-${chat.createdAt}`}
                                 className={`px-2 flex ${chat.sender !== userinfo.name ? 'justify-start' : 'justify-end'}`}>
                                <div className={'flex flex-col gap-1'}>
                                    <div className={'flex flex-col gap-1'}>
                                        {
                                            chat.sender !== userinfo.name
                                            && <span className={'text-xs'}>{chat.sender}</span>
                                        }
                                        <div className={'max-w-52 flex flex-col bg-gray-100 rounded p-1'}>
                                            <p className={'whitespace-pre-line'}>{chat.content}</p>
                                        </div>
                                    </div>
                                    <span className={`${chat.sender !== userinfo.name ? 'text-start' : 'text-end'} text-xs`}
                                    >
                                        {moment(chat.createdAt).format('MM-DD hh:mm:ss')}
                                    </span>
                                </div>
                            </div>
                        ))
                }
                <div ref={lastRef} className={'h-2'}/>
            </div>
            <div className={'flex my-1'}>
                <textarea className={'w-full mx-2 text-sm py-1 px-2 rounded border border-solid border-gray-200 outline-0 resize-none'}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={1}
                          onKeyDown={submitHotKeyHandler}
                          placeholder={'메시지를 입력하세요.(shift + enter로 전송)'}
                >
                </textarea>
                <button className={'min-w-12 bg-gray-700 text-white rounded'}
                        onClick={submitChatHandler}
                >전송</button>
            </div>
        </div>

    )
}


export default Chatting;