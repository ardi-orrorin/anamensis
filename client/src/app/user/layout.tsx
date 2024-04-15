'use client';

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {useState} from "react";
import {faBars} from "@fortawesome/free-solid-svg-icons";

export default function Layout({children}: {children: React.ReactNode}) {

    const [isOpen, setIsOpen] = useState<boolean>(true);

    const menuItems = [
        {name: '로그인기록', href:'/user/history'},
    ]
    return (
        <main className={'flex items-start'}>
            <nav className={['min-h-screen bg-blue-400 py-2 duration-300', isOpen ? 'translate-x-0 shadow-outset-lg w-[300px]' : 'translate-x-[-1000px] w-0'].join(' ')}>
                <div className={'flex justify-between px-4'}>
                    <div></div>
                    <div>
                        <button className={'mb-6'} onClick={()=>{setIsOpen(!isOpen)}}>
                            <FontAwesomeIcon icon={faXmark} className={'text-white text-xl'} />
                        </button>
                    </div>
                </div>
                <ul className={''}>
                    <div className={'text text-white px-3 mb-4'}>
                        <Link href={'/user'}
                        >User</Link>
                    </div>
                    {
                        menuItems.map((item, index) => {
                            return (
                                <li key={index}
                                    className={'p-3'}
                                >
                                    <Link className={'text text-white'}
                                          href={item.href}
                                    >{item.name}
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>
            <section className={'w-full flex flex-col justify-center border-s border-solid border-gray-200 p-4'}>
                <div className={'w-full flex items-start h-12'}>
                    <div className={['w-1/3 flex'].join(' ')}>
                        <button className={[isOpen ? 'hidden' : ''].join(' ')} onClick={()=>{setIsOpen(!isOpen)}}>
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    </div>
                    <div className={'w-1/3 flex justify-center text-lg'}>
                        <h1>로그인기록</h1>
                    </div>
                    <div className={'w-1/3 flex justify-end'}>
                        경로
                    </div>
                </div>
                <div>
                    {children}
                </div>

            </section>
        </main>
    )
}