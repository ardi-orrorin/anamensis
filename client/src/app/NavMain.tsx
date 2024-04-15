import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

type NavItemProps = {
    name: string | JSX.Element,
    url: string
    loginRequired?: boolean
    onClick?: () => void
}
const NavMain = ({cookie} : {cookie: () => ReadonlyRequestCookies}) => {
    const isLogged = cookie().get('accessToken') !== undefined;

    const menuItems : NavItemProps[] = [
        {
            name: 'Menu',
            url: '/public',
            loginRequired: false
        },
    ];

    const rightMenuItems : NavItemProps[] = [
        {
            name: 'Sign Up',
            url: '/signup',
            loginRequired: false

        },
        {
            name: 'Login',
            url: '/login',
            loginRequired: false
        },
        {
            name: <FontAwesomeIcon className={'w-4'} icon={faRightFromBracket} />,
            url: '/logout',
            loginRequired: true,
        },
        {
            name: <FontAwesomeIcon className={'w-4'} icon={faUser} />,
            url: '/user',
            loginRequired: true
        },
    ];

    return (
        <nav className={'w-full flex justify-between items-center bg-blue-500 text-white h-12'}>
            <div className={'w-1/3 duration-300'}>
                <ul className={'flex md:hidden h-full ms-4 w-4 duration-300'}>
                    <button className={'w-5'}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                </ul>
                <ul className={'hidden md:flex duration-300'}>
                    {
                        menuItems.map((item, index) => {
                            return <NavItem key={index} {...item} />
                        })
                    }
                </ul>
            </div>
            <div className={'w-1/3'}>
                <Link className={'flex justify-center p-3'}
                      href={'/'}
                >ANAMENSIS</Link>
            </div>
            <div className={'w-1/3'}>
                <ul className={'hidden md:flex md:flex-row-reverse '}>
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
            <Link className={'flex'} href={url} >{name}</Link>
        </li>
    );
}

export default NavMain;