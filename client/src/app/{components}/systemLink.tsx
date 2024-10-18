'use client';

import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGear} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import rootApiService from "@/app/{services}/rootApiService";
import {System} from "@/app/user/system/{services}/types";
import Role = System.Role;

const SystemLink = () => {

    const {data: roles} = useQuery(rootApiService.userRole());

    if(!roles.includes(Role.MASTER)) {
        return <></>
    }

    return (
        <li>
            <Link
                className={'w-10 h-10 flex justify-center items-center hover:bg-gray-800 rounded duration-500'}
                href={'/system'}
                prefetch={true}
                title={'시스템 설정'}
            >
                <FontAwesomeIcon icon={faGear}
                                 width={20}
                                 height={20}
                />
            </Link>
        </li>
    )
}

export default SystemLink;