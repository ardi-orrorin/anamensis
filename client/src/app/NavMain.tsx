import Link from "next/link";
import {cookies} from "next/headers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faRightFromBracket, faUser} from "@fortawesome/free-solid-svg-icons";

type NavItemProps = {
    name: string | JSX.Element,
    url: string
    loginRequired?: boolean
    onClick?: () => void
}
const NavMain = () => {

    const isLogged = cookies().get('accessToken') !== undefined
        || cookies().get('refreshToken') !== undefined

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
        <nav className={'w-full flex justify-between bg-blue-500 text-white px-3'}>
            <div className={'w-1/3 duration-300'}>
                <ul className={'flex md:hidden h-full w-4 duration-300'}>
                    <button className={'w-full'}>
                        <span>
                            <FontAwesomeIcon icon={faBars} />
                        </span>
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