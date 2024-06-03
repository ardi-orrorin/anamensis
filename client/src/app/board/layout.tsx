'use client';

import {ReactNode, useState} from "react";
import {faBars, faFlag} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import Link from "next/link";
import {faMessage} from "@fortawesome/free-solid-svg-icons/faMessage";






export default function Page({children} : {children: ReactNode}) {

    const [toggle, setToggle] = useState<boolean>(false);

    const menuItems = [
        {
            name: '공지사항',
            url: '/board?categoryPk=1',
            icon: faFlag,
            loginRequired: false
        },
        {
            name: '자유게시판',
            url: '/board?categoryPk=2',
            icon: faMessage,
            loginRequired: false
        },
    ];

    const onClickHandler = () => {
        setToggle(!toggle);
    }



    return (
        <div className={'flex'}>
            <div className={['bg-blue-500 duration-500 h-screen', toggle ? '-translate-x-full w-0' : 'w-52 translate-x-0 items-end shadow-md shadow-zinc-800'].join(' ')}>
                <div className={['flex flex-col w-full px-1 items-start duration-500', toggle ? 'hidden' : ''].join(' ')}>
                    <div className={'w-full flex justify-end'}>
                        <button className={'p-2 px-3 text-lg text-white hover:bg-blue-300 duration-300 rounded'}
                                onClick={onClickHandler}
                        >
                            <FontAwesomeIcon icon={faXmark} height={12} />
                        </button>
                    </div>
                    <ul className={'flex flex-col gap-2 text-white text-sm w-full'}>
                        {
                            menuItems.map((item, index) => {
                                return (
                                    <li key={`board-${index}`} className={'w-full py-1 px-2 hover:bg-blue-200 duration-500'}>
                                        <Link className={'flex gap-2 w-full'} href={item.url}>
                                            <span>
                                                <FontAwesomeIcon icon={item.icon} height={8} />
                                            </span>
                                            <span>
                                                {item.name}
                                            </span>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className={'w-full'}>
                <div className={'pt-5 px-5'}>
                {
                    toggle &&
                  <button onClick={onClickHandler}>
                    <FontAwesomeIcon icon={faBars} className={'border rounded border-blue-300 px-4 py-2 text-blue-400 hover:bg-blue-300 hover:text-white duration-500'}/>
                  </button>
                }
                </div>
                <div className={'p-5'}>
                    {children}
                </div>
            </div>
        </div>
    );
}