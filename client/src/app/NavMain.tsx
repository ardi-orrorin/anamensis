import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faRightFromBracket, faUser, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {cookies} from "next/headers";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons/faRightToBracket";
import Image from "next/image";
import {NO_IMAGE} from "@/app/{services}/constants";
import apiCall from "@/app/{commons}/func/api";

type NavItemProps = {
    name: string | JSX.Element,
    url: string
    loginRequired?: boolean,
    prefetch: boolean
    onClick?: () => void
}

const NavMain = async () => {

    const isLogged = (cookies()?.get('next.access.token')  || cookies()?.get('next.refresh.token')) !== undefined;

    const profileImg = isLogged && await apiCall<string>({
        path: '/api/user/profile-img',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true,
    });

    const rightMenuItems : NavItemProps[] = [
        {
            name: <FontAwesomeIcon className={'w-4'} icon={faPenToSquare} />,
            url: '/board/new?categoryPk=2',
            loginRequired: true,
            prefetch: true,
        },
        {
            name: <FontAwesomeIcon className={'w-4'} icon={faUserPlus} />,
            url: '/signup',
            loginRequired: false,
            prefetch: true,
        },
        {
            name: <FontAwesomeIcon className={'w-4'} icon={faRightToBracket} />,
            url: '/login',
            loginRequired: false,
            prefetch: true,
        },
        {
            name: <FontAwesomeIcon className={'w-4'} icon={faRightFromBracket} />,
            url: '/api/logout',
            loginRequired: true,
            prefetch: false,
        },
    ];

    return (
        <nav className={'w-full p-1 flex justify-between items-center bg-main text-white h-12'}>
            <div>
                <Link className={'px-2 h-10 flex justify-center items-center hover:bg-blue-800 rounded duration-500'}
                      href={'/'}
                >
                    <Image src={process.env.NEXT_PUBLIC_CDN_SERVER + '/favicon.jpg'}
                           alt={''}
                           width={30}
                           height={30}
                           priority={true}
                    />
                </Link>
            </div>
            <div className={'w-1/3 h-full'}>
                <ul className={'flex h-full justify-end'}>
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
                        && process.env.NEXT_PUBLIC_CDN_SERVER
                        && <div className={'flex h-full justify-center items-center px-2 hover:bg-blue-800 rounded duration-500'}>
                        <Link href={'/user'}>
                          <Image className={'rounded'}
                                 src={process.env.NEXT_PUBLIC_CDN_SERVER + profileImg}
                                 alt={''}
                                 width={30}
                                 height={30}
                          />
                        </Link>
                      </div>
                    }
                </ul>
            </div>
        </nav>
    );
}

const NavItem = ({name, url, prefetch}: NavItemProps) => {
    return (
        <li>
            <Link className={'w-10 h-10 flex justify-center items-center hover:bg-blue-800 rounded duration-500'}
                  href={url}
                  prefetch={prefetch}
            >{name}
            </Link>
        </li>
    );
}

export default NavMain;