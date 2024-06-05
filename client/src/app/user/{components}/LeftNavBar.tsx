import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import Link from "next/link";
import {faAddressCard, faCheckToSlot, faClockRotateLeft, faEnvelope, faKey} from "@fortawesome/free-solid-svg-icons";
import React from "react";
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
        {name: '유저 정보', href:'/user/info', icon: faCheckToSlot},
        {name: '로그인기록', href:'/user/history', icon: faClockRotateLeft},
        {name: 'SMTP', href:'/user/smtp', icon: faEnvelope},
        {name: 'SMTP 발송 내역', href:'/user/smtp-history', icon: faEnvelope},
        {name: 'OTP', href:'/user/otp', icon:faKey},
        {name: 'EMAIL', href:'/user/email', icon: faEnvelope},
        {name: 'SYSTEM', href:'/user/system', icon: faGear},
    ]

    return (
        <nav className={['fixed min-h-svh bg-blue-400 py-2 duration-500 w-[200px]', isOpen ? 'translate-x-0 shadow-outset-lg' : 'translate-x-[-1000px]'].join(' ')}>
            <div className={'flex justify-end pe-5'}>
                <button className={''} onClick={()=>{setIsOpen(!isOpen)}}>
                    <FontAwesomeIcon icon={faXmark} className={'text-white text-xl'} />
                </button>
            </div>
            <ul className={'w-full'}>
                <li className={'text text-white'}>
                    <Link href={'/user'}
                          onClick={()=>{setIsOpen(!isOpen)}}
                    >
                        <div className={'p-3 w-full hover:bg-blue-500'}>
                            <FontAwesomeIcon icon={faAddressCard} width={iconSize} />
                            <span>&nbsp; User</span>
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
                                      onClick={()=>{setIsOpen(!isOpen)}}
                                >
                                    <div className={'w-full p-3 hover:bg-blue-500 duration-300'}>
                                        <FontAwesomeIcon icon={item.icon} width={iconSize} />
                                        <span>&nbsp; {item.name}</span>
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