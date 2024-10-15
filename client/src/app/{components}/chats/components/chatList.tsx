import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import React, {useEffect, useMemo} from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import moment from "moment";
import {ActiveMenuEnum, useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";
import {defaultProfile} from "@/app/{commons}/func/image";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useQuery} from "@tanstack/react-query";
import {User} from "@/app/login/{services}/types";

const ChatList = () => {

    const {ws, chatList} = useWebSocket();
    const {data: userinfo} = useQuery(userInfoApiService.profile())

    useEffect(() => {
        ws.send(JSON.stringify({
            type: ChatSpace.WebSocketResponseType.CHATLIST
        }))
    }, []);

    return (
        <div className={'w-full'}>
            {
                chatList?.length > 0
                && chatList.toSorted((a, b) => moment(b.updatedAt).diff(moment(a.updatedAt)))
                    .map(chat => (
                    <Item key={chat.id} {...{chat, userinfo}}/>
                ))
            }
        </div>
    )
}

const Item = ({
    chat, userinfo
}: {
    chat: ChatSpace.ChatListItem,
    userinfo: User.UserInfo
}) => {

    const {ws, findChatMessageByChatRoomId} = useWebSocket();
    const {changeActiveMenuHandler} = useChatMenu();

    const roomName = useMemo(() =>
        chat.users.filter(user => user.userId !== userinfo.userId).map(user => user.userId).join(', ')
    ,[chat, userinfo])

    const onClickChatHandler = () => {
        changeActiveMenuHandler(ActiveMenuEnum.CHAT, chat.id);

        const message = findChatMessageByChatRoomId(chat.id);

        if(message?.chatMessages && message.chatMessages.size > 0 && moment().diff(message.createdAt, 'minutes') < 10) return;

        ws.send(JSON.stringify({
            type: ChatSpace.WebSocketResponseType.CHAT_MESSAGE,
            chatRoomId: chat.id
        }))
    }


    return (
        <button className={"w-full flex items-center justify-between p-2 border-y border-solid border-gray-200 hover:bg-gray-700 hover:text-white duration-300"}
                onClick={onClickChatHandler}
        >
            <div className={"flex items-center space-x-4"}>
                <div className={'relative min-w-10 max-w-10 max-h-10 min-h-10 rounded-full'}>
                    <img className={"w-full h-full rounded-full"}
                         src={defaultProfile('')}
                         alt="SSGPAY"
                    />
                    {
                        chat.unreadCount > 0
                        && <span className={`absolute flex justify-center items-center bottom-0 right-0 w-5 h-5 text-white text-xs2 rounded-full bg-red-600`}
                        >
                            {chat.unreadCount}
                        </span>
                    }

                </div>

                <div className={'flex flex-col items-start'}>
                    <p className="text-start font-semibold truncate w-24">{roomName}</p>
                    <p className="w-40 text-start text-sm truncate">{chat.lastMessage}</p>
                </div>
            </div>

            <p className="test-end text-gray-400 text-sm whitespace-pre-line">
                {
                    moment(chat.updatedAt).diff(moment(), 'day') > 1
                    ? moment(chat.updatedAt).format('MM-DD')
                    : moment(chat.updatedAt).fromNow()
                }
            </p>
        </button>
    )
}

export default React.memo(ChatList);