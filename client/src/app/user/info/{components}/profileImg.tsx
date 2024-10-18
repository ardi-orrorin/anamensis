'use client';

import Image from "next/image";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import React, {useRef, useState} from "react";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {UserInfoSpace} from "@/app/user/info/{services}/types";
import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useDefaultImage} from "@/app/{hooks}/useDefaultImage";

const ProfileImg = () => {

    const {data: profileImg , refetch} = useQuery(userApiService.profileImg());

    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState({} as UserInfoSpace.Loading);
    const [profileEnter, setProfileEnter] = useState(false);
    const debounce = createDebounce(500);
    const {defaultProfile} = useDefaultImage();

    const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const formdata = new FormData();

        formdata.append('file', e.target.files[0]);

        setLoading({
            ...loading,
            img: true
        });

        const fetch = async () => {
            await userInfoApiService.setProfileImg(formdata)

            setLoading({
                ...loading,
                img: false
            });

            await refetch();

            setProfileEnter(false)
        }

        debounce(fetch);
    }

    const onDeleteHandler = async () => {

        setLoading({
            ...loading,
            img: true
        })

        userInfoApiService.deleteProfileImg()
            .then((res) => {
                refetch();
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
                   onError={(e) => {
                       e.currentTarget.src = defaultProfile('')
                   }}
            />
            {
                !profileImg
                && <div className={'flex justify-center items-center absolute border-0 rounded-full left-0 top-0 w-[150px] h-[150px] z-10 bg-gray-200 opacity-70'}>
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
                   accept={'image/jpeg, image/png'}
                   onChange={onChangeHandler}
                   multiple={false}
                   hidden={true}
            />
        </div>
    )
}

export default ProfileImg;