import Link from "next/link";
import {cookies} from "next/headers";
import axios from "axios";
import {useRouter} from "next/navigation";


type NavItemProps = {
    name: string,
    url: string
    loginRequired?: boolean
    onClick?: () => void
}
const NavMain = () => {

    const isLogged = cookies().get('accessToken') !== undefined
        || cookies().get('refreshToken') !== undefined

    const menuItems : NavItemProps[] = [
        {
            name: 'Home',
            url: '/',
            loginRequired: false

        },
        {
            name: 'Public',
            url: '/public',
            loginRequired: false
        }
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
            name: 'Logout',
            url: '/logout',
            loginRequired: true,
        }
    ];



    return (
        <nav className={'w-full flex justify-between bg-blue-600 text-white px-3'}>
            <div>
                <ul className={'flex'}>
                    {
                        menuItems.map((item, index) => {
                            return <NavItem key={index} {...item} />
                        })
                    }
                </ul>
            </div>
            <div>
                <ul className={'flex'}>
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
            <Link href={url}>{name}</Link>
        </li>
    );
}

export default NavMain;