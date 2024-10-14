import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import React from "react";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import moment from "moment";

const ChatList = () => {

    const {chatList} = useWebSocket();

    return (
        <div className={'w-full'}>
            {
                chatList?.length > 0
                && chatList.map(chat => (
                    <Item key={chat.id} {...{chat}}/>
                ))
            }
        </div>
    )
}

const Item = ({chat}: {chat: ChatSpace.ChatListItem}) => {
    return (
        <button className={'w-full py-1 flex flex-col text-xs border-y border-solid border-gray-200 hover:bg-gray-700 hover:text-white duration-300'}
                onClick={() => {
                    console.log(chat.id)
                }}
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