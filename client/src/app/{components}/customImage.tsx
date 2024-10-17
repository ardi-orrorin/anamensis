'use client';

import Image from "next/image";
import {useQuery} from "@tanstack/react-query";
import userApiService from "@/app/user/{services}/userApiService";
import {useDefaultImage} from "@/app/{hooks}/useDefaultImage";

const CustomImage = () => {
    const {data:profileImg } = useQuery(userApiService.profileImg())
    const {defaultProfile} = useDefaultImage();
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