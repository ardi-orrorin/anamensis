import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import Link from "next/link";
import {faAddressCard, faClockRotateLeft, faEnvelope, faKey} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {ModalI} from "@/app/user/{services}/modalProvider";
import {faGear} from "@fortawesome/free-solid-svg-icons/faGear";

const LeftNavBar = ({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const iconSize = 16;

    const menuItems = [
        {name: '로그인기록', href:'/user/history', iconComponent: <FontAwesomeIcon icon={faClockRotateLeft} width={iconSize} />},
        {name: 'SMTP', href:'/user/smtp', iconComponent: <FontAwesomeIcon icon={faEnvelope} width={iconSize} />},
        {name: 'OTP', href:'/user/otp', iconComponent: <FontAwesomeIcon icon={faKey} width={iconSize} />},
        {name: 'EMAIL', href:'/user/email', iconComponent: <FontAwesomeIcon icon={faEnvelope} width={iconSize} />},
        {name: 'SYSTEM', href:'/user/system', iconComponent: <FontAwesomeIcon icon={faGear} width={iconSize} />},
    ]

    return (
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
    )
}

export default LeftNavBar;