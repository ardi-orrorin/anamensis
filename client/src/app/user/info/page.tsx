'use client'
import React, {useEffect, useRef, useState} from "react";
import Image from "next/image";
import axios from "axios";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {UserInfoI} from "@/app/user/email/page";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {defaultProfile} from "@/app/{commons}/func/image";
import useSWR, {mutate, preload} from "swr";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";


type loadingType = {
    profile : boolean,
    img     : boolean
}

const dataFetch = apiCall<UserInfoI>({
    path: '/api/user/info',
    method: 'GET',
    isReturnData: true,
});


const profileFetch = apiCall({
    path: '/api/user/info/profile-img',
    method: 'GET',
    isReturnData: true,
})
export default function Page() {

    const [img, setImg] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<loadingType>({} as loadingType);
    const [profile, setProfile] = useState<UserInfoI>({} as UserInfoI);

    const [profileEnter, setProfileEnter] = useState<boolean>(false);

    const debounce = createDebounce(500);

    useEffect(() => {
        preload('/user/info', async () => {
            return await apiCall<UserInfoI>({
                path: '/api/user/info',
                method: 'GET',
                isReturnData: true,
            })
        }).then((res) => {
            setProfile(res)
        });
    }, []);

    preload('/user/info/profile-img', async () => {
        return await apiCall({
            path: '/api/user/info/profile-img',
            method: 'GET',
            isReturnData: true,
        })
    }).then((res) => {
        setImg(res.length === 0 ? '' : res)
    });


    const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const formdata = new FormData();

        formdata.append('file', e.target.files[0]);

        setLoading({
            ...loading,
            img: true
        });

        const fetch = async () => {
            await apiCall({
                path: '/api/user/info/profile-img',
                method: 'POST',
                body: formdata,
                contentType: 'multipart/form-data',
            })
            .finally(async () => {
                setLoading({
                    ...loading,
                    img: false
                });
                setProfileEnter(false)
                await mutate('/user/info/profile-img', profileFetch);
            })
        }

        debounce(fetch);
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
                mutate('/user/info', dataFetch);
            });
        }

        debounce(fetch);
    }

    const onDeleteHandler = async () => {
        setLoading({
            ...loading,
            img: true
        })
        await apiCall({
            path: '/api/user/info/profile-img',
            method: 'DELETE',
        })
        .then((res) => {
            setImg('')
            mutate('/user/info/profile-img', profileFetch);
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            setLoading({
                ...loading,
                img: false
            });

        })
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({...profile, [e.target.name]: e.target.value})
    }

    const onMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
        setProfileEnter(true)
    }
    const onMouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
        setProfileEnter(false)
    }

    return (
        <main className={'flex flex-col gap-7 w-full justify-center items-center'}>
            <div className={'relative'}>
                <Image className={'rounded-full border-4 border-solid border-blue-200 w-[150px] h-[150px]'}
                       src={defaultProfile(img)}
                       alt={''}
                       placeholder={"empty"}
                       width={150}
                       height={150}
                       onMouseEnter={onMouseEnter}
                       priority={true}
                />
                {
                    !img &&
                    <div className={'flex justify-center items-center absolute border-0 rounded-full left-0 top-0 w-[150px] h-[150px] z-10 bg-gray-200 opacity-70'}>
                        {
                            loading.img
                            ? <LoadingSpinner size={20} />
                            : <button className={'w-full h-full text-xs'}
                                      onClick={()=> {inputRef.current?.click()}}
                            > 프로필 추가
                            </button>
                        }
                    </div>
                }
                {
                    profileEnter && img &&
                    <div className={'flex justify-center items-center absolute border-0 rounded-full left-0 top-0 w-[150px] h-[150px] z-10 opacity-50 bg-gray-200'}
                         onMouseLeave={onMouseLeave}
                    >
                        {
                            loading.img
                            ? <LoadingSpinner size={20} />
                            : <button className={'w-full h-full text-xs'}
                                      onClick={onDeleteHandler}
                            >프로필 삭제
                            </button>
                        }
                    </div>
                }

                <input ref={inputRef}
                       type={'file'}
                       accept={'image/*'}
                       onChange={onChangeHandler}
                       multiple={false}
                       hidden={true}
                />
            </div>
            <div className={'flex flex-col gap-3 w-full sm:w-2/3 md:w-[400px] duration-500'}>
                <div className={'flex gap-3'}>
                    <label className={'flex items-center w-36'}>이름</label>
                    <input className={'w-full px-3 py-2 outline-0 bg-blue-50 duration-300 text-sm'}
                           name={'name'}
                           value={profile.name}
                           onChange={onChange}
                    />
                </div>
                <div className={'flex gap-3'}>
                    <label className={'flex items-center w-36'}>이메일</label>
                    <input className={'w-full px-3 py-2 outline-0 focus:bg-blue-50 duration-300 text-sm disabled:bg-white'}
                           name={'email'}
                           value={profile.email}
                           onChange={onChange}
                           disabled={true}
                    />
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
                    <span className={'w-full px-3 py-2 outline-0 text-sm'}
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
                                        after:transition-all dark:border-gray-400 peer-checked:bg-blue-300"></div>
                        <span className="ms-3 text-sm fontclassNameum text-blue-700 items-center">
                            {profile.sauth ? '사용 중' : '사용 안함'}
                        </span>
                    </span>
                </div>
                <div className={'flex gap-3'}>
                    <span className={'flex items-center w-36'}>2차 인증 방법</span>
                    <span className={'w-full px-3 py-2 outline-0 text-sm'}
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
        </main>
    )
}
