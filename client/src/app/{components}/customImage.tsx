'use client';

import Image from "next/image";
import {NO_PROFILE} from "@/app/{services}/constants";
import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";
import {defaultProfile} from "@/app/{commons}/func/image";

const CustomImage = () => {
    const {data:profileImg } = useQuery(userApiService.profileImg())
    return (
        <Image className={'rounded'}
               src={defaultProfile(profileImg)}
               alt={''}
               width={30}
               height={30}
               onError={(e) =>
                   e.currentTarget.src = defaultProfile('')
               }
        />
    );
}

export default CustomImage;