import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear, faPenToSquare, faRightFromBracket, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {cookies} from "next/headers";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons/faRightToBracket";
import Image from "next/image";
import {Root} from "@/app/{services}/types";
import ScheduleAlert from "@/app/{components}/modal/scheduleAlert";
import React from "react";
import CustomImage from "@/app/{components}/customImage";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import SystemLink from "@/app/{components}/systemLink";
import RightNavMain from "@/app/{components}/rightNavMain";

const NavMain = async () => {

    const isLogined = (cookies()?.get('next.access.token')  || cookies()?.get('next.refresh.token')) !== undefined;

    return (
        <nav className={'w-full min-w-full p-1 flex justify-between items-center bg-gray-700 text-white h-12'}>
            <div>
                <Link className={'px-2 h-10 flex justify-center items-center hover:bg-gray-800 rounded duration-500'}
                      href={'/'}
                      title={'홈'}
                >
                    <Image src={'/static/ms-icon-310x310.png'}
                           alt={''}
                           width={30}
                           height={30}
                           priority={true}
                    />
                </Link>
            </div>
            <div className={'w-full h-full flex justify-end'}>
                <RightNavMain {...{isLogined}} />
            </div>
        </nav>
    );
}



export default NavMain;