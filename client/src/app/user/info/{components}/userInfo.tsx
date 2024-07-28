'use client';

import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import React, {useEffect, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {LoadingType} from "@/app/user/info/page";
import {UserInfoI} from "@/app/user/email/page";

export const UserInfo = ({profileInfo}: {profileInfo: UserInfoI}) => {

    const [profile, setProfile] = useState<UserInfoI>({} as UserInfoI);

    const [loading, setLoading] = useState<LoadingType>({} as LoadingType);

    const debounce = createDebounce(500);

    useEffect(()=> {
        setProfile(profileInfo);
    },[profileInfo]);


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({...profile, [e.target.name]: e.target.value})
    }

    const onSubmitHandler = async () => {
        setLoading({
            ...loading,
            profile: true
        })

        const fetch = async () => {
            await apiCall({
                path: '/api/user/info',
                method: 'PUT',
                body: profile,
            })
            .then((res) => {
                alert('수정되었습니다.')
            }).finally(() => {
                setLoading({
                    ...loading,
                    profile: false
                });
            });
        }

        debounce(fetch);
    }

    return (
        <div className={'flex flex-col gap-3 w-full sm:w-2/3 md:w-[400px] duration-500'}>
            <div className={'flex gap-3'}>
                <span className={'flex items-center w-36'}>아이디</span>
                <span className={'w-full py-2 outline-0 text-sm'}
                >
                    {profile.userId}
                </span>
            </div>
            <div className={'flex gap-3'}>
                <label className={'flex items-center w-36'}>이름</label>
                <input className={'w-full px-3 py-2 outline-0 bg-blue-50 duration-300 text-sm'}
                       name={'name'}
                       value={profile.name}
                       onChange={onChange}
                />
            </div>
            <div className={'flex gap-3'}>
                <span className={'flex items-center w-36'}>이메일</span>
                <span className={'w-full py-2 outline-0 text-sm'}
                >
                    {profile.email}
                </span>
            </div>
            <div className={'flex gap-3'}>
                <label className={'flex items-center w-36'}>연락처</label>
                <input className={'w-full px-3 py-2 outline-0 bg-blue-50 duration-300 text-sm'}
                       name={'phone'}
                       value={profile.phone}
                       onChange={onChange}
                />
            </div>
            <div className={'flex gap-3'}>
                <span className={'flex items-center w-36'}>포인트</span>
                <span className={'w-full py-2 outline-0 text-sm'}
                >{profile.point}
                    </span>
            </div>
            <div className={'flex gap-3'}>
                <span className={'flex items-center w-36'}>2차 인증 사용</span>
                <span className="w-full px-3 py-2 inline-flex items-center cursor-pointer">
                        <input type="checkbox" className={"sr-only peer hidden"} checked={profile.sauth} disabled/>
                        <div className="relative w-11 h-6 ray-200 peer-focus:outline-none peer-focus:ring-4
                                        peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-300
                                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                                        after:transition-all dark:border-gray-400 peer-checked:bg-main"></div>
                        <span className="ms-3 text-sm fontclassNameum text-blue-700 items-center">
                            {profile.sauth ? '사용 중' : '사용 안함'}
                        </span>
                    </span>
            </div>
            <div className={'flex gap-3'}>
                <span className={'flex items-center w-36'}>2차 인증 방법</span>
                <span className={'w-full py-2 outline-0 text-sm'}
                >{profile.sauthType}
                    </span>
            </div>
            <div>
                <button className={'w-full rounded bg-blue-300 text-white py-2'}
                        onClick={onSubmitHandler}
                >
                    {
                        loading.profile
                            ? <LoadingSpinner size={10} />
                            : <span>수정</span>
                    }
                </button>
            </div>
        </div>
    );
}

export default UserInfo;
