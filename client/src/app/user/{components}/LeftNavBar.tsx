import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import Link from "next/link";
import {
    faAddressCard,
    faBan,
    faClockRotateLeft,
    faEnvelope,
    faFilePowerpoint,
    faGear,
    faKey,
    faRectangleList,
    faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import React, {useCallback, useMemo} from "react";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import {faTableList} from "@fortawesome/free-solid-svg-icons/faTableList";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import Image from "next/image";
import {System} from "@/app/system/message/{services}/types";
import {usePrefetchQuery, useQuery} from "@tanstack/react-query";
import rootApiService from "@/app/{services}/rootApiService";
import userApiService from "@/app/user/{services}/userApiService";
import emailApiService from "@/app/user/email/{services}/emailApiService";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useDefaultImage} from "@/app/{hooks}/useDefaultImage";

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

    usePrefetchQuery(emailApiService.userInfo());
    usePrefetchQuery(userInfoApiService.profile());


    const {data: roles} = useQuery(rootApiService.userRole());
    const {data: profileImg} = useQuery(userApiService.profileImg());

    const {defaultProfile} = useDefaultImage();

    const isOAuthUser = useMemo(() =>
            roles && roles?.find(role =>
            role === System.Role.OAUTH)
        , [roles]);

    const iconSize = 16;
    const menuItems: MenuItemType[] = [
        {name: 'SYSTEM', href:'/user/system', icon: faGear, role: System.Role.ADMIN},
    ]

    const openToggle = useCallback(() => {
        bodyScrollToggle(false, false);
        setIsModalMode(!isModalMode);
        setIsOpen(!isOpen);
        localStorage.setItem('isModalMode', JSON.stringify(!isModalMode));
    },[isModalMode, isOpen]);

    const closeToggle = useCallback(() => {
        bodyScrollToggle(false, true);
        setIsOpen(false);
        localStorage.setItem('isModalMode', JSON.stringify(false));
    },[isModalMode, isOpen]);

    const onChangeDisabledHandler = useCallback(() => {
        bodyScrollToggle(false, true);
        setIsOpen(false);
    },[]);

    const roleMenu = useMemo(()=>
        menuItems.map((item, index) => {
            if(!item.role || !roles?.find(role => role === item.role)) {
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

    return (
        <>
        <nav className={['top-0 flex flex-col min-h-screen z-30 bg-gray-700 py-2 duration-500'
            , isOpen || !isModalMode  ? 'sticky translate-x-0 shadow-outset-lg' : 'translate-x-[-1000px]'
            , isModalMode ? 'fixed min-w-[200px]': 'w-[40px] sm:min-w-[200px]'
        ].join(' ')}
             data-testid={'left-nav-bar-container'}
        >
            <div className={[
                'flex justify-between h-full duration-500',
                isModalMode ? 'gap-0 px-5': 'flex-col sm:flex-row px-0 gap-4 sm:gap-0 sm:px-5 py-2'
            ].join(' ')}>
                <button onClick={openToggle}
                        className={'text-white'}
                        data-testid={'fixed-toggle'}
                >
                    {
                        isModalMode
                        ? <FontAwesomeIcon icon={faRectangleList} />
                        : <FontAwesomeIcon icon={faTableList} />
                    }
                </button>
                {
                    isModalMode
                    && <button onClick={closeToggle}
                               data-testid={'left-nav-bar-close'}
                    >
                        <FontAwesomeIcon icon={faXmark} className={'text-white text-xl'} />
                    </button>
                }

            </div>
            <ul className={'w-full h-full duration-500'}
                data-testid={'left-nav-bar'}
            >
                <li className={'flex justify-center py-2 sm:py-4'}>
                    <Link className={'sm:p-1.5 sm:border-4 border-solid border-blue-300 rounded-full'}
                          href={'/user/info'}
                          onClick={onChangeDisabledHandler}
                    >
                        <Image className={[
                            'rounded-full border-solid duration-500 border-blue-200 hover:border-blue-500',
                            isModalMode ? '' : 'w-[25px] sm:w-[110px] h-[25px] sm:h-[110px]'
                        ].join(' ')}
                               src={defaultProfile(profileImg)}
                               alt={''}
                               width={110}
                               height={110}
                               priority={true}
                               fetchPriority={"high"}
                               onError={e => {
                                     e.currentTarget.src = defaultProfile('');
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