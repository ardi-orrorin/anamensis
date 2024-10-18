import {useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";
import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import moment from "moment";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import {UserStatus} from "@/app/{components}/chats/services/Status";
import {Virtuoso} from "react-virtuoso";
import {User} from "@/app/login/{services}/types";
import ChatMessage = ChatSpace.ChatMessage;
import {useDefaultImage} from "@/app/{hooks}/useDefaultImage";

const Chatting = () => {

    const {activeMenu} = useChatMenu();
    const {ws, chatMessages, findChatMessageByChatRoomId, initUnreadCount, users,} = useWebSocket();
    const [content, setContent] = useState<string>('');
    const {data: userinfo} = useQuery(userInfoApiService.profile())

    useEffect(() => {
        initUnreadCount(activeMenu.detailId);
    }, [activeMenu.detailId, chatMessages.length]);

    const submitHotKeyHandler = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(e.nativeEvent.isComposing) return;
        if(e.key === 'Enter' && !e.shiftKey) {
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
    },[content, ws, activeMenu.detailId])

    const data = useMemo(() => {
        return Array.from(findChatMessageByChatRoomId(activeMenu.detailId)?.chatMessages || [])
    }, [chatMessages, activeMenu.detailId])

    return (
        <div className={'w-full h-full text-xs flex flex-col'}>
            <div className={'h-full'}>
                {/* fixme: 배열의 변동이 없으면 마지막 행으로 이동하지 않음 */}

                {
                    data.length === 0
                    ? <div className={'w-full h-full flex justify-center items-center text-gray-700'}>
                        새로운 대화를 시작합니다.
                    </div>
                    : <Virtuoso style={{height: '100%'}}
                          totalCount={data.length}
                          data={data}
                          firstItemIndex={data.length}
                          followOutput={'smooth'}
                          itemContent={(_, chat) => {
                              const user = users.find(user => user.username === chat.sender);
                              return (
                                  <div className={'py-2'}>
                                      <ChatComponent key={`chat-${chat.id}-${chat.chatRoomId}`}
                                                     {...{chat, userinfo, user}}
                                      />
                                  </div>
                              )
                          }}
                          onClick={() => initUnreadCount(activeMenu.detailId)}
                    />
                }
            </div>
            <div className={'flex m-1'}>
                <textarea className={'w-full mr-2 text-sm py-1 px-2 rounded border border-solid border-gray-200 outline-0 resize-none'}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={1}
                          onKeyDown={submitHotKeyHandler}
                          placeholder={'메시지를 입력하세요.'}
                          onFocus={() => initUnreadCount(activeMenu.detailId)}
                >
                </textarea>
                <button className={'min-w-12 bg-gray-700 text-white rounded'}
                        onClick={submitChatHandler}
                >전송</button>
            </div>
        </div>

    )
}

const ChatComponent = ({
    chat, userinfo, user
}: {
    chat     : ChatMessage,
    user     : ChatSpace.UserStatus | undefined
    userinfo : User.UserInfo,
}) => {

    const {defaultProfile} = useDefaultImage();

    return (
        <div className={`px-2 flex ${chat.sender !== userinfo.name ? 'justify-start' : 'justify-end'}`}>
            <div className={'flex items-start gap-1'}>
                {
                    chat.sender !== userinfo.name
                    && <div className={'relative'}>
                        <Image src={defaultProfile(user?.profileImage)}
                               alt={''}
                               width={40}
                               height={40}
                               className={'rounded-full'}
                               onError={(e) => e.currentTarget.src = defaultProfile('')}
                        />
                            {
                                user
                                && <div className={`absolute right-0 bottom-0 w-3 h-3 rounded-full bg-${UserStatus.fromString(user.status)?.color}`} />
                            }
                    </div>
                }

                <div className={'flex flex-col gap-1'}>
                    <div className={'flex flex-col gap-1'}>
                        {
                            chat.sender !== userinfo.name
                            && <span className={'text-xs'}>{chat.sender}</span>
                        }
                        <div className={'max-w-52 min-w-0 w-auto flex flex-col bg-gray-100 rounded p-2'}>
                            <p className={'whitespace-pre-line'}>{chat.content}</p>
                        </div>
                    </div>
                    <span
                        className={`${chat.sender !== userinfo.name ? 'text-start' : 'text-end'} text-xs`}
                    >
                        {moment(chat.createdAt).format('MM-DD hh:mm:ss')}
                    </span>
                </div>
            </div>
        </div>
    )
}


export default Chatting;