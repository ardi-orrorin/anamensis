'use client';

import Image from "next/image";
import {defaultProfile} from "@/app/{commons}/func/image";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import React, {useContext, useEffect, useRef, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {LoadingType} from "@/app/user/info/page";
import UserProvider from "@/app/user/{services}/userProvider";

const ProfileImg = () => {

    const {profileImg, setProfileImg} = useContext(UserProvider);

    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<LoadingType>({} as LoadingType);
    const [profileEnter, setProfileEnter] = useState<boolean>(false);
    const debounce = createDebounce(500);

    useEffect(()=> {
        if(profileImg) return;

        apiCall<string>({
            path: '/api/user/info/profile-img',
            method: 'GET',
            isReturnData: true,
        })
        .then(res => {
            setProfileImg(res);
        });
    },[])



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
            });

            setLoading({
                ...loading,
                img: false
            });

            await apiCall<string>({
                path: '/api/user/info/profile-img',
                method: 'GET',
                isReturnData: true,
            })
            .then(res => {
                setProfileImg(res);
            });

            setProfileEnter(false)
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
                setProfileImg('');
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

    const onMouseEnter = (e: React.MouseEvent<HTMLImageElement>) => {
        setProfileEnter(true)
    }
    const onMouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
        setProfileEnter(false)
    }

    return (
        <div className={'relative'}>
            <Image className={'rounded-full border-4 border-solid border-main w-[150px] h-[150px]'}
                   src={defaultProfile(profileImg)}
                   alt={''}
                   placeholder={"empty"}
                   width={150}
                   height={150}
                   onMouseEnter={onMouseEnter}
                   priority={true}
            />
            {
                !profileImg &&
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
                profileEnter && profileImg &&
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
    )
}

export default ProfileImg;