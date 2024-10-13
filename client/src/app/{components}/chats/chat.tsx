'use client';

import {faCommentDots, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import {useState} from "react";
import {defaultProfile} from "@/app/{commons}/func/image";
import {ChatSpace} from "@/app/{components}/chats/services/types";
import {StatusEnum, UserStatus} from "@/app/{components}/chats/services/Status";

const Chat = () => {

    const {ws, users} = useWebSocket();
    const [toggle, setToggle] = useState<boolean>(false);
    const [activeMenu, setActiveMenu] = useState<string>('');

    const changeStatus = (status: StatusEnum) => {
        ws?.send(JSON.stringify({
            type: 'STATUS',
            status: status
        }));

    }

    return (
        <div className={'fixed z-[400] flex flex-col gap-2 left-5 bottom-5'}>
            {
                toggle
                && <div className={'flex flex-col w-80 h-80 bg-white border-y-4 border-y-gray-800 border-solid  text-sm rounded drop-shadow-xl shadow-black'}>
                    <header className={'flex px-2 justify-between items-center h-8 border-b border-solid border-gray-200 border-r-opacity-10'}>
                        <span>Chat</span>
                        <select className={'text-xs w-20 h-4 bg-gray-200 rounded'}
                                onChange={(e) => changeStatus(e.target.value as StatusEnum)}
                        >
                            <option value={'ONLINE'}>온라인</option>
                            <option value={'OFFLINE'}>오프라인</option>
                            <option value={'WORKING'}>작업중</option>
                            <option value={'AWAY'}>자리비움</option>
                        </select>

                    </header>
                    <div className={'flex h-full drop'}>
                        <nav className={'flex justify-center gap-1 min-w-16 max-w-16 border-r border-solid border-gray-200 border-r-opacity-10'}>
                            <div className={'w-full flex justify-center'}>
                              <button className={'w-10 h-10 m-2 flex justify-center items-center rounded-full bg-gray-200'}
                                      onClick={() => setActiveMenu('profile')}
                              >
                                <FontAwesomeIcon icon={faUser} />
                              </button>
                            </div>
                        </nav>
                        {
                            activeMenu === 'profile'
                            && profileList({users})
                        }
                    </div>
                </div>
            }
            <button
                className={'w-14 h-14 flex justify-center items-center drop-shadow-md shadow-black bg-white rounded-full'}
                onClick={() => setToggle(!toggle)}
            >
                <FontAwesomeIcon icon={faCommentDots} size={'xl'} />
            </button>
        </div>
    )
}

const profileList = ({users}:{users: ChatSpace.UserStatus[]}) => {

    return (
        <div className={'w-full max-h-80 flex flex-col gap-0.5 overflow-y-auto'}>
            {
                users?.length > 0
                && users?.map((user, index) => (
                    <div key={index} className={'px-2 py-2 flex items-center gap-2 hover:bg-gray-300 duration-300'}>
                        <img className={`w-7 h-7 rounded-2xl border-4 border-solid border-${UserStatus.fromString(user.status)?.color}`}
                             src={defaultProfile(user.profileImage)}
                             alt={''}
                             onError={(e) => {
                                 e.currentTarget.src = defaultProfile("")
                             }}/>
                        <span>{user.username}</span>
                    </div>
                ))
            }
        </div>
    )

}

export default Chat;