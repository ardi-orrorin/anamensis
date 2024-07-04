'use client';

import React, {useContext, useMemo, useState} from "react";
import {AuthType} from "@/app/login/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {mutate, preload} from "swr";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import UserInfoProvider, {UserInfoI} from "@/app/user/email/{services}/userInfoProvider";


export interface AuthPropsI {
    sauthType: AuthType;
    sauth: boolean;
}

const fetchData = apiCall<UserInfoI>({
    path: '/api/user/email',
    method: 'GET',
    isReturnData: true,
})

export default function Page() {
    const {userInfo, setUserInfo} = useContext(UserInfoProvider);
    const [loading, setLoading] = useState<boolean>(false);

    preload('/user/email', async () => {
        return await apiCall<UserInfoI>({
            path: '/api/user/email',
            method: 'GET',
            isReturnData: true,
        })
    })
    .then(res => {
        setUserInfo(res);
    })

    const isSAuthEmail = useMemo(() => {
        return userInfo.sauthType === AuthType.EMAIL && userInfo.sauth;
    },[userInfo]);


    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {

        const data: AuthPropsI = {
            sauth: e.target.checked,
            sauthType: userInfo.sauthType !== AuthType.EMAIL ? AuthType.EMAIL : AuthType.NONE
        };

        setLoading(true);
        apiCall<UserInfoI, AuthPropsI>({
            path: '/api/user/email',
            method: 'PUT',
            body: data,
            isReturnData: true,
        }).then(async (res) => {
            await mutate('/user/email', fetchData);
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            <div className={'flex flex-col gap-5 w-full'}>
                <div className={'flex flex-col gap-3'}>
                    <h1 className={'text-lg font-bold'}>
                        이메일
                    </h1>
                    <span className={'h-5 text-blue-700'}>
                        {userInfo.email}
                    </span>
                </div>

                <div className={'flex flex-col gap-3'}>
                    <h1 className={'text-lg font-bold'}>
                        Email 2차 인증 사용 여부
                    </h1>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox"
                               className={"sr-only peer hidden"}
                               checked={isSAuthEmail}
                               onChange={onChangeHandler}
                        />
                        <div className="relative w-11 h-6 ray-200 peer-focus:outline-none peer-focus:ring-4
                                        peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300
                                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                        after:transition-all dark:border-gray-600 peer-checked:bg-blue-300"></div>
                        <span className="ms-3 text-sm fontclassNameum text-blue-7000 items-center">
                            {isSAuthEmail ? '사용 중' : '사용 안함'}
                        </span>
                    </label>
                </div>
                <div className={'flex flex-col gap-3'}>
                    <h1 className={'text-lg font-bold'}>
                        사용 중인 인증 방식
                    </h1>
                    <span className={'h-5 text-blue-700'}>
                       {userInfo.sauthType}
                    </span>
                </div>
            </div>
            {
                loading &&
                <div className={'w-full h-screen bg-gray-400 opacity-25 absolute left-0 top-0 flex justify-center items-center'}>
                    <FontAwesomeIcon className={'animate-spin h-12'} icon={faSpinner} />
                </div>
            }

        </div>
    )
}

