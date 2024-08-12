'use client';

import Image from "next/image";
import {NO_PROFILE} from "@/app/{services}/constants";
import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

const CustomImage = () => {

    const {data: profileImg, isLoading} = useQuery(userApiService.profileImg());

    if(isLoading || profileImg === '') return <LoadingSpinner size={20} />;
    return (
        <Image className={'rounded'}
               src={process.env.NEXT_PUBLIC_CDN_SERVER + profileImg}
               alt={''}
               width={30}
               height={30}
               onError={(e) =>
                   e.currentTarget.src = NO_PROFILE
               }
        />
    );
}

export default CustomImage;