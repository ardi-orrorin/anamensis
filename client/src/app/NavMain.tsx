import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faRightFromBracket, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {cookies} from "next/headers";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons/faRightToBracket";
import Image from "next/image";
import {Root} from "@/app/{services}/types";
import ScheduleAlert from "@/app/{components}/scheduleAlert";
import React from "react";
import CustomImage from "@/app/{components}/customImage";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

const DynamicCustomImage = dynamic(() => import('@/app/{components}/customImage'), {
    loading: () => <div className={'h-[140px] flex items-center'}><LoadingSpinner size={30}/></div>,
    ssr: false});

const NavMain = async () => {

    const isLogged = (cookies()?.get('next.access.token')  || cookies()?.get('next.refresh.token')) !== undefined;

    const rightMenuItems : Root.NavItemProps[] = [
        {
            icon: faPenToSquare,
            name: '글쓰기',
            url: '/board/new?categoryPk=2',
            loginRequired: true,
            prefetch: true,
        },
        {
            icon: faUserPlus,
            name: '회원가입',
            url: '/signup',
            loginRequired: false,
            prefetch: true,
        },
        {
            icon: faRightToBracket,
            name: '로그인',
            url: '/login',
            loginRequired: false,
            prefetch: true,
        },
        {
            icon: faRightFromBracket,
            name: '로그아웃',
            url: '/api/logout',
            loginRequired: true,
            prefetch: false,
        },
    ];

    return (
        <nav className={'w-full min-w-full p-1 flex justify-between items-center bg-gray-700 text-white h-12'}>
            <div>
                <Link className={'px-2 h-10 flex justify-center items-center hover:bg-gray-800 rounded duration-500'}
                      href={'/'}
                      title={'홈'}
                >
                    <Image src={'/static/ms-icon-310x310.png'}
                           alt={''}
                           width={30}
                           height={30}
                           priority={true}
                    />
                </Link>
            </div>
            <div className={'w-full h-full flex justify-end'}>
                <ul className={'flex w-full h-full justify-end gap-2'}>
                    {
                        isLogged
                        && <ScheduleAlert />
                    }
                    {
                        rightMenuItems.map((item, index) => {
                            if(!item.loginRequired === isLogged) {
                                return ;
                            }
                            return <NavItem key={index} {...item} />
                        })
                    }
                    {
                        isLogged
                        && <div className={'flex h-full justify-center items-center px-1.5 hover:bg-gray-800 rounded duration-500'}>
                        <Link href={'/user'}
                              title={'프로필'}
                        >
                          <DynamicCustomImage />
                        </Link>
                      </div>
                    }
                </ul>
            </div>
        </nav>
    );
}

const NavItem = ({icon, name, url, prefetch}: Root.NavItemProps) => {
    return (
        <li>
            <Link className={'w-10 h-10 flex justify-center items-center hover:bg-gray-800 rounded duration-500'}
                  href={url}
                  prefetch={prefetch}
                  title={name}
            >
                <FontAwesomeIcon icon={icon}
                                 width={20}
                                 height={20}
                />
            </Link>
        </li>
    );
}

export default NavMain;