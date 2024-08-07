import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import Link from "next/link";
import {
    faAddressCard,
    faBan,
    faClockRotateLeft,
    faEnvelope,
    faEnvelopesBulk,
    faFilePowerpoint,
    faGear,
    faKey,
    faRectangleList,
    faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import React, {useCallback, useContext, useEffect, useMemo} from "react";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import {faTableList} from "@fortawesome/free-solid-svg-icons/faTableList";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import useSWR from "swr";
import apiCall from "@/app/{commons}/func/api";
import UserProvider from "@/app/user/{services}/userProvider";
import Image from "next/image";
import {NO_IMAGE} from "@/app/{services}/constants";
import {System} from "@/app/user/system/{services}/types";

type MenuItemType = {
    name: string,
    href: string,
    icon: IconDefinition,
    role: System.Role
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

    const { roles, setRoles, profileImg, setProfileImg } = useContext(UserProvider);
    const isOAuthUser = useMemo(() => roles.find(role => role === System.Role.OAUTH), [roles]);

    const iconSize = 16;
    const menuItems: MenuItemType[] = [
        {name: 'SYSTEM', href:'/user/system', icon: faGear, role: System.Role.ADMIN},
        {name: '권한관리', href:'/user/users-role', icon: faUserGear, role: System.Role.MASTER},
    ]

    useEffect(()=> {
        if(profileImg) return;

        apiCall<string>({
            path: '/api/user/info/profile-img',
            method: 'GET',
            isReturnData: true,
        })
        .then(res => {
            setProfileImg(res);
        });
    },[])

    useSWR('/user/navBar', async () => {
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
    },{
        revalidateOnFocus: false
    });

    const openToggle = useCallback(() => {
        bodyScrollToggle(false, false);
        setIsModalMode(!isModalMode);
        setIsOpen(!isOpen);
        localStorage.setItem('isModalMode', JSON.stringify(!isModalMode));
    },[isModalMode, isOpen]);


    const onChangeDisabledHandler = useCallback(() => {
        bodyScrollToggle(false, true);
        setIsOpen(false);
    },[]);

    const roleMenu = useMemo(()=>
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
                        <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                            <FontAwesomeIcon icon={item.icon} width={iconSize} />
                            <span className={isModalMode ? '' : 'hidden sm:inline'}>{item.name}</span>
                        </div>
                    </Link>
                </li>
            )
        })
    , [menuItems, roles]);

    if(roles.length === 0) return <></>

    return (
        <>
        <nav className={['z-30 min-h-dvh bg-main py-2 duration-500'
            , isOpen || !isModalMode  ? 'translate-x-0 shadow-outset-lg' : 'translate-x-[-1000px]'
            , isModalMode ? 'fixed w-[220px]': 'w-[40px] sm:min-w-[200px]'
        ].join(' ')}>
            <div className={[
                'flex justify-between',
                isModalMode ? 'gap-0 px-5': 'flex-col sm:flex-row px-0 gap-4 sm:gap-0 sm:px-5 py-2'
            ].join(' ')}>
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
            <ul className={'w-full duration-500'}>
                <li className={'flex justify-center py-2 sm:py-4'}>
                    <Link className={'sm:p-1.5 sm:border-4 border-solid border-blue-300 rounded-full'}
                          href={'/user/info'}
                          onClick={onChangeDisabledHandler}
                    >
                        <Image className={[
                            'rounded-full border-solid duration-500 border-blue-200 hover:border-blue-500',
                            isModalMode ? '' : 'w-[25px] sm:w-[110px] h-[25px] sm:h-[110px]'
                        ].join(' ')}
                               src={process.env.NEXT_PUBLIC_CDN_SERVER + profileImg || NO_IMAGE}
                               alt={''}
                               width={110}
                               height={110}
                               priority={true}
                               fetchPriority={"high"}
                               onError={e => {
                                     e.currentTarget.src = NO_IMAGE;
                               }}
                        />
                    </Link>
                </li>
                <li className={'text text-white'}>
                    <Link href={'/user'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'p-3 flex gap-2 w-full hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                            <FontAwesomeIcon icon={faAddressCard} width={iconSize} />
                            <span className={isModalMode ? '' : 'hidden sm:inline'}>대시보드</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/history'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                            <FontAwesomeIcon icon={faClockRotateLeft} width={iconSize} />
                            <span className={isModalMode ? '' : 'hidden sm:inline'}>로그인기록</span>
                        </div>
                    </Link>
                </li>
                {
                    !isOAuthUser
                    && <li className={'w-full'}>
                        <Link className={'text text-white w-full'}
                              href={'/user/email'}
                              onClick={onChangeDisabledHandler}
                        >
                          <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                            <FontAwesomeIcon icon={faEnvelope} width={iconSize} />
                            <span className={isModalMode ? '' : 'hidden sm:inline'}>EMAIL</span>
                          </div>
                        </Link>
                    </li>
                }

                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/point-history'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                            <FontAwesomeIcon icon={faFilePowerpoint} width={iconSize} />
                            <span className={isModalMode ? '' : 'hidden sm:inline'}>포인트 적립 내역</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/smtp'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                            <FontAwesomeIcon icon={faEnvelope} width={iconSize} />
                            <span className={isModalMode ? '' : 'hidden sm:inline'}>SMTP</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/smtp-history'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                            <FontAwesomeIcon icon={faEnvelopesBulk} width={iconSize}/>
                            <span className={isModalMode ? '' : 'hidden sm:inline'}>SMTP 발송 내역</span>
                        </div>
                    </Link>
                </li>
                <li className={'w-full'}>
                    <Link className={'text text-white w-full'}
                          href={'/user/board-block'}
                          onClick={onChangeDisabledHandler}
                    >
                        <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                            <FontAwesomeIcon icon={faBan} width={iconSize} />
                            <span className={isModalMode ? '' : 'hidden sm:inline'}>열람 제한 내역</span>
                        </div>
                    </Link>
                </li>
                {
                    !isOAuthUser
                    && <>
                      <li className={'w-full'}>
                        <Link className={'text text-white w-full'}
                              href={'/user/otp'}
                              onClick={onChangeDisabledHandler}
                            >
                            <div className={'w-full flex gap-2 p-3 hover:bg-blue-500 active:bg-blue-800 duration-300'}>
                                <FontAwesomeIcon icon={faKey} width={iconSize} />
                              <span className={isModalMode ? '' : 'hidden sm:inline'}>OTP</span>
                            </div>
                        </Link>
                      </li>
                    </>
                }
                { roleMenu }
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

export default React.memo(LeftNavBar, (prev, next) => {
    return prev.isOpen      === next.isOpen
        && prev.isModalMode === next.isModalMode;
});