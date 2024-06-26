import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faRightFromBracket, faUser, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {cookies} from "next/headers";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons/faRightToBracket";

type NavItemProps = {
    name: string | JSX.Element,
    url: string
    loginRequired?: boolean,
    onClick?: () => void
}

const NavMain = async () => {

    const isLogged = (cookies().get('next.access.token')  || cookies().get('next.refresh.token')) !== undefined;

    const rightMenuItems : NavItemProps[] = [
        {
            name: <FontAwesomeIcon icon={faPenToSquare} />,
            url: '/board/new?categoryPk=2',
            loginRequired: true,
        },
        {
            name: <FontAwesomeIcon icon={faUserPlus} />,
            url: '/signup',
            loginRequired: false,
        },
        {
            name: <FontAwesomeIcon className={'w-4'} icon={faUser} />,
            url: '/user',
            loginRequired: true,
        },
        {
            name: <FontAwesomeIcon icon={faRightToBracket} />,
            url: '/login',
            loginRequired: false,
        },
        {
            name: <FontAwesomeIcon className={'w-4'} icon={faRightFromBracket} />,
            url: '/api/logout',
            loginRequired: true,
        },
    ];

    return (
        <nav className={'w-full flex justify-between items-center bg-blue-500 text-white h-12'}>
            <div className={''}>
                <Link className={'flex justify-center p-3'}
                      href={'/'}
                >ANAMENSIS</Link>
            </div>
            <div className={'w-1/3'}>
                <ul className={'flex justify-end'}>
                    {
                        rightMenuItems.map((item, index) => {
                            if(!item.loginRequired === isLogged) {
                                return ;
                            }
                            return <NavItem key={index} {...item} />
                        })
                    }
                </ul>
            </div>
        </nav>
    );
}

const NavItem = ({name, url}: NavItemProps) => {
    return (
        <li className={'p-3'}>
            <Link className={'flex'} href={url} prefetch={false}>{name}</Link>
        </li>
    );
}

export default NavMain;