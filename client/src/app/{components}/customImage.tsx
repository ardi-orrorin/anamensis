'use client';

import Image from "next/image";
import {NO_PROFILE} from "@/app/{services}/constants";
import {usePrefetchQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";

const CustomImage = ({ src } : { src: string }) => {

    usePrefetchQuery(userApiService.attend());
    usePrefetchQuery(userApiService.boardSummery());
    usePrefetchQuery(userApiService.pointSummary());
    usePrefetchQuery(userApiService.profileImg());

    return (
        <Image className={'rounded'}
               src={process.env.NEXT_PUBLIC_CDN_SERVER + src}
               alt={''}
               width={30}
               height={30}
               onError={(e) =>
                   e.currentTarget.src = NO_PROFILE
        }/>
    );
}

export default CustomImage;