'use client';

import Image from "next/image";
import {defaultProfile} from "@/app/{commons}/func/image";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import React, {useEffect, useRef, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {LoadingType} from "@/app/user/info/page";

const ProfileImg = ({imgData} : {imgData: string}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<LoadingType>({} as LoadingType);
    const [profileEnter, setProfileEnter] = useState<boolean>(false);
    const [img, setImg] = useState<string>('');
    const debounce = createDebounce(500);

    useEffect(()=>{
        setImg(imgData);
    },[imgData])


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

            const img = await apiCall({
                path: '/api/user/info/profile-img',
                method: 'GET',
                isReturnData: true,
            })

            setImg(img);
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
                setImg('')
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
    )
}

export default ProfileImg;