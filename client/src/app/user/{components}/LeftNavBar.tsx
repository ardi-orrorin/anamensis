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
    faRectangleList, faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect} from "react";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import {faTableList} from "@fortawesome/free-solid-svg-icons/faTableList";
import {RoleType} from "@/app/user/system/{services}/types";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import useSWR from "swr";
import apiCall from "@/app/{commons}/func/api";

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

    const [roles, setRoles] = React.useState<RoleType[]>([]);

    const iconSize = 16;
    const menuItems: MenuItemType[] = [
        {name: 'SYSTEM', href:'/user/system', icon: faGear, role: RoleType.ADMIN},
        {name: '권한관리', href:'/user/users-role', icon: faUserGear, role: RoleType.MASTER},
    ]

    const initFetch = useSWR('/user/navBar', async () => {
        await apiCall({
            path: '/api/user/roles',
            method: 'GET',
        })
        .then(res => {
            const roles = res.headers['next.user.roles'] || ''
            if(roles) {
                setRoles(JSON.parse(res.headers['next.user.roles']));
            }
        });
    });

    const openToggle = () => {
        bodyScrollToggle(false, false);
        setIsModalMode(!isModalMode);
        setIsOpen(!isOpen);
        localStorage.setItem('isModalMode', JSON.stringify(!isModalMode));
    }


    const onChangeDisabledHandler = () => {
        bodyScrollToggle(false, true);
        setIsOpen(false);
    }

    return (
        <>
        <nav className={['z-30 min-h-svh bg-blue-400 py-2 duration-500 '
            , isOpen || !isModalMode  ? 'translate-x-0 shadow-outset-lg' : 'translate-x-[-1000px]'
            , isModalMode ? 'fixed w-[220px]': 'min-w-[200px]'
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
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/info'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'flex w-full p-3 hover:bg-blue-500 duration-300'}>
                            <FontAwesomeIcon icon={faCheckToSlot} width={iconSize} />
                            <span>&nbsp; 유저 정보</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/history'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                            <FontAwesomeIcon icon={faClockRotateLeft} width={iconSize} />
                            <span>&nbsp; 로그인기록</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/email'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                            <FontAwesomeIcon icon={faEnvelope} width={iconSize} />
                            <span>&nbsp; EMAIL</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/point-history'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                            <FontAwesomeIcon icon={faFilePowerpoint} width={iconSize} />
                            <span>&nbsp; 포인트 적립 내역</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/smtp'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                            <FontAwesomeIcon icon={faEnvelope} width={iconSize} />
                            <span>&nbsp; SMTP</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/smtp-history'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                            <FontAwesomeIcon icon={faEnvelope} width={iconSize} />
                            <span>&nbsp; SMTP 발송 내역</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/otp'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                            <FontAwesomeIcon icon={faKey} width={iconSize} />
                            <span>&nbsp; OTP</span>
                        </div>
                    </Link>
                </li>
                {
                    menuItems.map((item, index) => {
                        if(!item.role || !roles.find(role => role === item.role)) {
                            return null;
                        }

                        return (
                            <li key={'userleftnavbar' + index}
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