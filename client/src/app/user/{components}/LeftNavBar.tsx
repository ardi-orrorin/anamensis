import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import Link from "next/link";
import {
    faAddressCard,
    faCheckToSlot,
    faClockRotateLeft,
    faEnvelope,
    faFilePowerpoint,
    faGear,
    faKey,
    faRectangleList,
} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect} from "react";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import {faTableList} from "@fortawesome/free-solid-svg-icons/faTableList";
import {RoleType} from "@/app/user/system/{services}/types";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

type MenuItemType = {
    name: string,
    href: string,
    icon: IconDefinition,
    role: RoleType
}

const LeftNavBar = ({
    isOpen,
    setIsOpen,
    isModalMode,
    setIsModalMode
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    isModalMode: boolean,
    setIsModalMode: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const iconSize = 16;
    const menuItems: MenuItemType[] = [
        {name: '유저 정보', href:'/user/info', icon: faCheckToSlot, role: RoleType.USER},
        {name: '로그인기록', href:'/user/history', icon: faClockRotateLeft, role: RoleType.USER},
        {name: 'SMTP', href:'/user/smtp', icon: faEnvelope, role: RoleType.ADMIN},
        {name: 'SMTP 발송 내역', href:'/user/smtp-history', icon: faEnvelope, role: RoleType.ADMIN},
        {name: 'OTP', href:'/user/otp', icon:faKey, role: RoleType.MASTER},
        {name: 'EMAIL', href:'/user/email', icon: faEnvelope, role: RoleType.USER},
        {name: 'SYSTEM', href:'/user/system', icon: faGear, role: RoleType.ADMIN},
        {name: '포인트 적립 내역', href:'/user/point-history', icon: faFilePowerpoint, role: RoleType.USER},
    ]

    const [roles, setRoles] = React.useState<RoleType[]>([]);

    useEffect(() => {
        const roles = JSON.parse(localStorage.getItem('roles') || '[]') as RoleType[]
        setRoles(roles);
    },[]);

    const openToggle = () => {
        bodyScrollToggle();
        setIsModalMode(!isModalMode);
        setIsOpen(!isOpen);
    }

    const fixedToggle = () => {
        bodyScrollToggle();
        setIsOpen(!isOpen);
    }

    const onChangeDisabledHandler = () => {
        setIsOpen(false);
    }

    return (
        <>
        <nav className={['z-30 min-h-svh bg-blue-400 py-2 duration-500 '
            , isOpen || !isModalMode  ? 'translate-x-0 shadow-outset-lg' : 'translate-x-[-1000px]'
            , isModalMode ? 'fixed w-[220px]': 'w-[250px]'
        ].join(' ')}>
            <div className={'flex justify-between px-5 py-2'}>
                <button onClick={openToggle} className={'text-white'}>
                    {
                        isModalMode
                        ? <FontAwesomeIcon icon={faRectangleList} />
                        : <FontAwesomeIcon icon={faTableList} />
                    }
                </button>
                <button onClick={openToggle}>
                    <FontAwesomeIcon icon={faXmark} className={'text-white text-xl'} />
                </button>
            </div>
            <ul className={'w-full'}>
                <li className={'text text-white'}>
                    <Link href={'/user'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'p-3 w-full hover:bg-blue-500'}>
                            <FontAwesomeIcon icon={faAddressCard} width={iconSize} />
                            <span>&nbsp; User</span>
                        </div>
                    </Link>
                </li>
                {
                    menuItems.map((item, index) => {
                        if(!item.role || !roles.find(role => role === item.role)) {
                            return null;
                        }

                        return (
                            <li key={index}
                                className={'w-full'}
                            >
                                <Link className={'text text-white w-full'}
                                      href={item.href}
                                      onClick={onChangeDisabledHandler}
                                >
                                    <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                                        <FontAwesomeIcon icon={item.icon} width={iconSize} />
                                        <span>&nbsp; {item.name}</span>
                                    </div>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        </nav>
            {
                isOpen
                && <div className={'absolute z-10 bg-opacity-25 bg-gray-800 w-full h-full'}
                        onClick={onChangeDisabledHandler}
                   />
            }
        </>
    )
}

export default LeftNavBar;