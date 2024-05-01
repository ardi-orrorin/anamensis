'use client'
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import axios from "axios";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {UserInfoI} from "@/app/user/attend/page";

type loadingType = {
    profile : boolean,
    img     : boolean
}

export default function Page() {

    const [img, setImg] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<loadingType>({} as loadingType);
    const [profile, setProfile] = useState<UserInfoI>({} as UserInfoI);

    const [profileEnter, setProfileEnter] = useState<boolean>(false);

    useEffect(() => {
        axios.get('/api/user/info')
            .then((res) => {
                setProfile(res.data)
            })
    },[])

    useEffect(() => {

        axios.get('/api/user/info/profile-img')
            .then((res) => {
                setImg(process.env.NEXT_PUBLIC_CDN_SERVER + res.data)
            })
    },[]);

    const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files) return;

        const formdata = new FormData();
        formdata.append('file', e.target.files[0]);

        setLoading({
            ...loading,
            img: true
        });

        await axios.post('/api/user/info/profile-img', formdata)
            .then((res) => {
                setImg(process.env.NEXT_PUBLIC_CDN_SERVER + res.data)
            }).finally(() => {
                setLoading({
                    ...loading,
                    img: false
                });
                setProfileEnter(false)
            })
    }

    const onSubmitHandler = async () => {
        setLoading({
            ...loading,
            profile: true
        })
        await axios.put('/api/user/info', profile)
            .then((res) => {
            //
            }).finally(() => {
                setLoading({
                    ...loading,
                    profile: false
                });
            });
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
                       src={img || '/noimage.jpg'}
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
                            loading.img &&
                            <LoadingSpinner size={20} />
                        }
                        {
                            !loading.img &&
                            <button className={'w-full h-full text-xs'}
                                    onClick={()=> {inputRef.current?.click()}}
                            >
                              프로필 추가
                            </button>
                        }
                    </div>
                }
                {
                    profileEnter && img &&
                    <div className={'flex justify-center items-center absolute border-0 rounded-full left-0 top-0 w-[150px] h-[150px] z-10 opacity-50 bg-gray-200'}
                         onMouseLeave={onMouseLeave}
                    >
                      <button className={'w-full h-full text-xs'}
                              onClick={()=> {setImg('');}}
                      >
                        프로필 삭제
                      </button>
                    </div>
                }

                <input ref={inputRef}
                       type={'file'}
                       onChange={onChangeHandler}
                       multiple={false}
                       hidden={true}
                />
            </div>
            <div className={'flex flex-col gap-3 w-full sm:w-2/3 md:w-[400px] duration-500'}>
                <div className={'flex gap-3'}>
                    <span className={'flex items-center w-20'}>이름</span>
                    <input className={'w-full px-3 py-2 outline-0 focus:bg-blue-50 duration-300 text-sm'}
                           name={'name'}
                           value={profile.name}
                           onChange={onChange}
                    />
                </div>
                <div className={'flex gap-3'}>
                    <span className={'flex items-center w-20'}>이메일</span>
                    <input className={'w-full px-3 py-2 outline-0 focus:bg-blue-50 duration-300 text-sm'}
                           name={'email'}
                           value={profile.email}
                           onChange={onChange}
                    />
                </div>
                <div className={'flex gap-3'}>
                    <span className={'flex items-center w-20'}>연락처</span>
                    <input className={'w-full px-3 py-2 outline-0 focus:bg-blue-50 duration-300 text-sm'}
                           name={'phone'}
                           value={profile.phone}
                           onChange={onChange}
                    />
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
