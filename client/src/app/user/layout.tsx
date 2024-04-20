'use client';

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import React, {useState} from "react";
import {faAddressCard, faBars, faClockRotateLeft, faEnvelope, faKey} from "@fortawesome/free-solid-svg-icons";


export default function Layout({children}: {children: React.ReactNode}) {

    const [isOpen, setIsOpen] = useState<boolean>(true);
    const iconSize = 16;

    const menuItems = [
        {name: '로그인기록', href:'/user/history', iconComponent: <FontAwesomeIcon icon={faClockRotateLeft} width={iconSize} />},
        {name: 'SMTP 설정', href:'/user/smtp', iconComponent: <FontAwesomeIcon icon={faEnvelope} width={iconSize} />},
        {name: 'OTP 설정', href:'/user/otp', iconComponent: <FontAwesomeIcon icon={faKey} width={iconSize} />},
        {name: 'EMAIL 인증 설정', href:'/user/email', iconComponent: <FontAwesomeIcon icon={faEnvelope} width={iconSize} />},
    ]
    
    return (
        <main className={'flex items-start'}>
            <nav className={['min-h-svh bg-blue-400 py-2 duration-300', isOpen ? 'translate-x-0 shadow-outset-lg w-10 md:w-[300px]' : 'translate-x-[-1000px] w-0'].join(' ')}>
                <div className={'flex justify-center md:justify-end md:pe-5'}>
                    <button className={''} onClick={()=>{setIsOpen(!isOpen)}}>
                        <FontAwesomeIcon icon={faXmark} className={'text-white text-xl'} />
                    </button>
                </div>
                <ul className={'w-full'}>
                    <li className={'text text-white'}>
                        <Link href={'/user'}
                        >
                            <div className={'p-3 w-full hover:bg-blue-500 duration-300'}>
                                <FontAwesomeIcon icon={faAddressCard} width={iconSize} />

                                <span className={'hidden md:inline'}>&nbsp; User</span>
                            </div>
                        </Link>
                    </li>
                    {
                        menuItems.map((item, index) => {
                            return (
                                <li key={index}
                                    className={'w-full'}
                                >
                                    <Link className={'text text-white w-full'}
                                          href={item.href}
                                    >
                                        <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                                            {item.iconComponent}
                                            <span className={'hidden md:inline'}>&nbsp; {item.name}</span>

                                        </div>
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