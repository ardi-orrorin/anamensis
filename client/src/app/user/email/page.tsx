'use client';
import React, {useContext, useEffect, useMemo, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {useRouter} from "next/navigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import useSWR from "swr";
import UserProvider from "@/app/user/{services}/userProvider";
import {User} from "@/app/login/{services}/types";
import {System} from "@/app/user/system/{services}/types";

export default function Page() {

    const {roles} = useContext(UserProvider);
    const [userInfo, setUserInfo] = useState({} as User.UserInfo);
    const [loading, setLoading] = useState(false);
    const isSAuthEmail = useMemo(() => {
        return userInfo.sauthType === User.AuthType.EMAIL && userInfo.sauth;
    },[userInfo]);

    const isOAuthUser = useMemo(() =>
        roles.some((role) => role === System.Role.OAUTH)
        ,[roles]);

    const router = useRouter();

    useEffect(()=>{
        if(!isOAuthUser) return;
        alert('접근할 수 없는 페이지 입니다.');
        router.push('/user');
    },[roles]);


    const { mutate } = useSWR('/api/user/info', async () => {
        return await apiCall<User.UserInfo>({
            path: '/api/user/info',
            method: 'GET',
            isReturnData: true,
        })
        .then(res => {
            setUserInfo(res);
        });
    },{});


    const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const data: User.AuthProps = {
            sauth: e.target.checked,
            sauthType: userInfo.sauthType !== User.AuthType.EMAIL ? User.AuthType.EMAIL : User.AuthType.NONE
        };

        setLoading(true);
        await apiCall<User.UserInfo, User.AuthProps>({
            path: '/api/user/email',
            method: 'PUT',
            body: data,
            isReturnData: true,
        }).then(async (res) => {
            await mutate();
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        });
    }

    if(isOAuthUser) return <></>

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
                                        after:transition-all dark:border-gray-600 peer-checked:bg-main"></div>
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

