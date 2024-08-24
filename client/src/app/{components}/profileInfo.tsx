import {useRouter} from "next/navigation";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import React, {useMemo} from "react";
import Link from "next/link";
import Image from "next/image";
import {NO_PROFILE} from "@/app/{services}/constants";

const ProfileInfo = () => {
    const router = useRouter()

    const profileImg = useQueryClient().getQueryData(['profileImg']);

    const {data: userinfo} = useQuery(userInfoApiService.profile())

    const point = useMemo(() =>
            userinfo?.point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        , [userinfo.point])

    return (
        <div className={'pb-4 w-full flex flex-col gap-2 border-b border-solid border-b-gray-200'}
             data-testid={'profile-info'}
        >
            <div className={'flex justify-between items-end text-sm'}>
                <span className={'font-bold'}>
                    프로필
                </span>
                <Link className={'flex justify-end text-xs text-blue-500'}
                      href={'/user/info'}
                >
                    수정
                </Link>
            </div>
            <div className={'flex gap-4'}>
                <div className={'flex flex-col gap-2'}>
                    <button className={'w-[95px] h-[95px] p-1.5 flex justify-center items-center border-4 border-solid border-main rounded-full hover:border-amber-500 duration-500'}
                            onClick={()=> router.push('/user/info')}
                    >
                        <Image src={process.env.NEXT_PUBLIC_CDN_SERVER! + profileImg}
                                 alt={''}
                                 height={90}
                                 width={90}
                                 className={'shadow rounded-full'}
                                 placeholder={'blur'}
                                 blurDataURL={NO_PROFILE}
                                 onError={(e) => {
                                     e.currentTarget.src = NO_PROFILE
                                 }}
                        />
                    </button>
                </div>
                <div>
                    <div className={'flex flex-col gap-2'}>
                        <div className={'flex'}>
                            <span className={'text-xs min-w-10 font-bold'}>ID</span>
                            <span className={'text-xs'}>{userinfo?.userId}</span>
                        </div>
                        <div className={'flex'}>
                            <span className={'text-xs min-w-10 font-bold'}>이름</span>
                            <span className={'text-xs'}>{userinfo?.name}</span>
                        </div>
                        <div className={'flex'}>
                            <span className={'text-xs min-w-10 font-bold'}>이메일</span>
                            <span className={'text-xs'}>{userinfo?.email}</span>
                        </div>
                        <div className={'flex'}>
                            <span className={'text-xs min-w-10 font-bold'}>포인트</span>
                            <span className={'text-xs'}>{point}</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default React.memo(ProfileInfo);