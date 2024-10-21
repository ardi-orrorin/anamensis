'use client';

import ScheduleAlert from "@/app/{components}/scheduleAlert";
import Link from "next/link";
import SystemLink from "@/app/{components}/systemLink";
import React from "react";
import {Root} from "@/app/{services}/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faRightFromBracket, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons/faRightToBracket";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {useQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";

const DynamicCustomImage = dynamic(() => import('@/app/{components}/customImage'), {
    loading: () => <div className={'h-[140px] flex items-center'}><LoadingSpinner size={30}/></div>,
    ssr: false});

const RightNavMain = ({
    isLogined,
}: {
    isLogined: boolean;
}) => {
    const {data: systemConfig} = useQuery(systemApiServices.getPublicSystemConfig());

    const rightMenuItems : Root.NavItemProps[] = [
        {
            icon: faPenToSquare,
            name: '글쓰기',
            url: '/board/new?categoryPk=2',
            loginRequired: true,
            prefetch: true,
            view: true
        },
        {
            icon: faUserPlus,
            name: '회원가입',
            url: '/signup',
            loginRequired: false,
            prefetch: true,
            view: systemConfig?.sign_up?.enabled,
        },
        {
            icon: faRightToBracket,
            name: '로그인',
            url: '/login',
            loginRequired: false,
            prefetch: true,
            view: true,
        },
        {
            icon: faRightFromBracket,
            name: '로그아웃',
            url: '/api/logout',
            loginRequired: true,
            prefetch: false,
            view: true,
        },
    ];
    return (
        <ul className={'flex w-full h-full justify-end gap-2'}>
            {
                isLogined
                && <ScheduleAlert/>
            }
            {
                rightMenuItems.map((item, index) => {
                    if (!item.loginRequired === isLogined || !item.view) {
                        return;
                    }
                    return <NavItem key={'right-nav-menu' + index} {...item} />
                })
            }
            {
                isLogined
                && <div className={'flex h-full justify-center items-center px-1.5 hover:bg-gray-800 rounded duration-500'}>
                    <Link href={'/user'}
                          title={'프로필'}
                    >
                      <DynamicCustomImage />
                    </Link>
                </div>
            }
            {
                isLogined
                && <SystemLink/>
            }
        </ul>
    )
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

export default React.memo(RightNavMain, (prevProps, nextProps) => {
    return prevProps.isLogined === nextProps.isLogined;
});