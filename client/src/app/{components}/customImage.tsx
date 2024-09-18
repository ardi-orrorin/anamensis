'use client';

import Image from "next/image";
import {NO_PROFILE} from "@/app/{services}/constants";
import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";

const CustomImage = () => {
    const {data:profileImg } = useQuery(userApiService.profileImg())

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