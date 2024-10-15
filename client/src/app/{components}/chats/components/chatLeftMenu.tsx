import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleInfo, faMessage, faUsers} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {ActiveMenuEnum, useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";
import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";

const ChatLeftMenu = () => {

    const {userInfo} = useWebSocket();
    const menus = [
        {icon: faUsers, value: ActiveMenuEnum.PROFILE, view: true},
        {icon: faMessage, value: ActiveMenuEnum.CHATLIST, view: true},
        {icon: faCircleInfo, value: ActiveMenuEnum.INFO, view: userInfo.userId},
    ];

    return (
        <nav
            className={'flex justify-center gap-1 min-w-16 max-w-16 border-r border-solid border-gray-200 border-r-opacity-10'}>
            <div className={'w-full flex flex-col justify-start'}>
                {
                    menus
                        .filter(menu => menu.view)
                        .map((menu, index) => (
                        <ChatLeftMenuBtn key={`menu-${index}`} {...{...menu}} />
                    ))

                }
            </div>
        </nav>
    )
}


const ChatLeftMenuBtn = ({
    icon, value
} : {
    icon: IconProp,
    value: ActiveMenuEnum
}) => {

    const { activeMenu, changeActiveMenuHandler } = useChatMenu();

    return (
        <button
            className={`w-full h-12 flex justify-center items-center border-b border-gray-200 hover:bg-gray-200 duration-300 ${activeMenu.type === value ? 'bg-gray-700 text-white' : ''}`}
            onClick={() => changeActiveMenuHandler(value, 0)}
        >
            <FontAwesomeIcon icon={icon}/>
        </button>
    )
}

export default React.memo(ChatLeftMenu);