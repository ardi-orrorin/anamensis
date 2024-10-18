'use client';

import {faCommentDots, faExpand, faMinimize} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import {StatusEnum} from "@/app/{components}/chats/services/Status";
import ProfileList from "@/app/{components}/chats/components/profileList";
import ChatLeftMenu from "@/app/{components}/chats/components/chatLeftMenu";
import {ActiveMenuEnum, useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";
import UserInfo from "@/app/{components}/chats/components/userInfo";
import ChatList from "@/app/{components}/chats/components/chatList";
import {useEffect, useState} from "react";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useQuery} from "@tanstack/react-query";
import {faWindowMinimize} from "@fortawesome/free-solid-svg-icons/faWindowMinimize";
import Chatting from "@/app/{components}/chats/components/chatting";
import moment from "moment/moment";
import {useHotkeys} from "react-hotkeys-hook";

require('moment/locale/ko');
moment.locale('ko');

const Chat = () => {

    const {ws, users, changeStatusHandler, chatList} = useWebSocket();
    const {activeMenu, changeToggleHandler} = useChatMenu();
    const {data: userinfo} = useQuery(userInfoApiService.profile())

    const [isExpand, setIsExpand] = useState<boolean>(false);

    const [awayTimeout, setAwayTimeout] = useState<NodeJS.Timeout>();

    const unreadCount = chatList.reduce((acc, chat) => acc + chat.unreadCount, 0);

    useEffect(() => {
        if(ws.readyState !== ws.OPEN) return;
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [ws]);

    // fixme: 브라우저 비활성화 자리비움 상태로 변경
    const handleVisibilityChange = () => {
        const wait = 1000 * 60 * 5;
        if (document.visibilityState === 'hidden') {
            const change = setTimeout(() => {
                changeStatusHandler(StatusEnum.AWAY);
            }, wait);

            setAwayTimeout(change);
        } else {
            clearTimeout(awayTimeout);
            changeStatusHandler(StatusEnum.ONLINE);
        }
    };

    return (
        <div className={'fixed z-[400] flex flex-col gap-2 left-5 bottom-5'}>
            {
                activeMenu.toggle
                && <div className={`flex flex-col ${isExpand ? 'w-[90vw] sm:w-[550px] h-[80vh]' : 'w-[400px] h-80'} bg-white border-y-6 border-y-gray-800 border-solid text-sm rounded drop-shadow-xl shadow-black duration-500`}>
                    <header className={'flex px-2 justify-between items-center h-10 border-b border-solid border-gray-200 border-r-opacity-10'}>
                        <button className={'w-6 h-6 flex justify-center items-center hover:bg-gray-700 hover:text-white duration-300 rounded'}
                                onClick={() => changeToggleHandler(!activeMenu.toggle)}
                        >
                            <FontAwesomeIcon icon={faWindowMinimize} size={'sm'} />
                        </button>
                        <div className={'flex gap-2'}>
                            <select className={'text-xs w-20 h-6 px-1 bg-gray-200 rounded'}
                                    onChange={(e) => changeStatusHandler(e.target.value as StatusEnum)}
                                    value={users.find(user => user.username === userinfo.name)?.status}
                            >
                                <option value={StatusEnum.ONLINE}>온라인</option>
                                <option value={StatusEnum.OFFLINE}>오프라인</option>
                                <option value={StatusEnum.WORKING}>작업중</option>
                                <option value={StatusEnum.AWAY}>자리비움</option>
                            </select>
                            <button className={'w-6 h-6 flex justify-center items-center hover:bg-gray-700 hover:text-white duration-300 rounded'}
                                    onClick={() => setIsExpand(!isExpand)}
                            >
                                <FontAwesomeIcon icon={isExpand ? faMinimize: faExpand} />
                            </button>
                        </div>
                    </header>
                    <div className={'flex h-full overflow-y-auto'}>
                        <ChatLeftMenu />
                        {
                            ActiveMenuEnum.PROFILE === activeMenu.type
                            ? <ProfileList />
                            : ActiveMenuEnum.CHATLIST === activeMenu.type
                            ? <ChatList />
                            : ActiveMenuEnum.CHAT === activeMenu.type
                            ? <Chatting />
                            : ActiveMenuEnum.INFO === activeMenu.type
                            ? <UserInfo />
                            : <></>
                        }
                    </div>
                </div>
            }
            <button
                className={'relative w-14 h-14 flex justify-center items-center drop-shadow-md shadow-black bg-white rounded-full'}
                onClick={() => changeToggleHandler(!activeMenu.toggle)}
            >
                <FontAwesomeIcon icon={faCommentDots} size={'xl'} />
                {
                    unreadCount > 0
                    && <div className={'absolute bottom-0 right-0 flex justify-center items-center text-xs text-white rounded-full w-6 h-6 bg-red-600'}>
                        {unreadCount}
                    </div>
                }
            </button>
        </div>
    )
}

export default Chat;