import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import {faTableList} from "@fortawesome/free-solid-svg-icons/faTableList";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {faEnvelope, faGears, faUserGear} from "@fortawesome/free-solid-svg-icons";

const SystemLeftNavBar = () => {
    return (
        <nav className={'flex flex-col h-screen z-30 bg-gray-700 py-2 duration-500 translate-x-0 shadow-outset-lg w-[40x] sm:min-w-[200px]'}
             data-testid={'left-nav-bar-container'}
        >
            <div className={'flex justify-between h-full duration-500 flex-col sm:flex-row px-0 gap-4 sm:gap-0 py-2'}>

                <ul className={'w-full h-full duration-500'}
                    data-testid={'left-nav-bar'}
                >
                    <h1 className={'ps-3 p-3 font-bold text-white'}>시스템 설정</h1>
                    <ListItem icon={faTableList} text={'SITE'} href={'/system'}/>
                    <ListItem icon={faEnvelope} text={'SMTP'} href={'/system/smtp'}/>
                    <ListItem icon={faUserGear} text={'ACCOUNT'} href={'/system/account'}/>
                    <ListItem icon={faGears} text={'O-AUTH'} href={'/system/oauth'}/>
                    <ListItem icon={faUserGear} text={'ACCOUNTS-ROLES'} href={'/system/users-role'}/>
                    <ListItem icon={faGears} text={'SYSTEM-MESSAGE'} href={'/system/message'}/>
                    <ListItem icon={faGears} text={'POINT'} href={'/system/point'}/>
                    <ListItem icon={faGears} text={'CACHE'} href={'/system/cache'}/>
                    <ListItem icon={faGears} text={'BOARD'} href={'/system/board'}/>
                </ul>
            </div>
        </nav>
    )
}

const ListItem = ({
                      icon, text, href
}: {
    icon: IconDefinition,
    text: string,
    href: string
}) => {
    return (
        <li className={'w-full'}>
            <Link className={'text text-white w-full'}
                  href={href}
            >
                <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                    <FontAwesomeIcon icon={icon} width={16}/>
                    <span className={'hidden sm:block'}>{text}</span>
                </div>
            </Link>
        </li>
    )
}

export default React.memo(SystemLeftNavBar);