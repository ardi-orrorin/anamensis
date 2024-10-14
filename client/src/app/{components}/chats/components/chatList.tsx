import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import React, {useEffect} from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import moment from "moment";
import {ActiveMenuEnum, useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";

const ChatList = () => {

    const {ws, chatList} = useWebSocket();

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
                    <Item key={chat.id} {...{chat}}/>
                ))
            }
        </div>
    )
}

const Item = ({chat}: {chat: ChatSpace.ChatListItem}) => {

    const {ws, chatMessages} = useWebSocket();
    const {changeActiveMenuHandler} = useChatMenu();

    const onClickChat = () => {
        changeActiveMenuHandler(ActiveMenuEnum.CHAT, chat.id);

        if(chatMessages.chatMessages.size > 0 && moment().diff(chatMessages.createdAt, 'minutes') < 10) return;

        ws.send(JSON.stringify({
            type: ChatSpace.WebSocketResponseType.CHAT_MESSAGE,
            chatRoomId: chat.id
        }))

    }
    return (
        <button className={'w-full py-1 flex flex-col text-xs border-y border-solid border-gray-200 hover:bg-gray-700 hover:text-white duration-300'}
                onClick={onClickChat}
        >
            <div className={'px-2'}>
                <span>
                    {chat.type}
                </span>
            </div>
            <div className={'h-12'}>
                <p className={'px-2 py-1'}>
                    {chat.lastMessage}
                </p>
            </div>
            <div className={'w-full px-2 flex justify-between'}>
                <span>참여자 수: {chat.userCount}</span>
                <span>updateAt: {moment(chat.updatedAt).format('MM-DD hh:mm')}</span>
            </div>
        </button>
    )
}

export default React.memo(ChatList);