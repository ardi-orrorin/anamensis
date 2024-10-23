'use client';

import {createContext, useContext, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";

interface DefaultImageContextI {
    defaultProfile: (img: string | undefined | null) => string;
    defaultNoImg: (img: string | undefined | null) => string;
}
const DefaultImageContext = createContext<DefaultImageContextI>({} as DefaultImageContextI);

export const DefaultImageProvider = ({children}: {children: React.ReactNode}) => {

    const {data} = useQuery(systemApiServices.getPublicSystemConfig());

    const defaultProfile = (img: string | undefined | null) =>
        defaultImage({img, defaultImg: '/static/default_profile.jpg'});

    const defaultNoImg = (img: string | undefined | null) =>
        defaultImage({img, defaultImg: '/noimage.jpg'});


    const defaultImage = ({
      img, defaultImg
    }:{
        img: string | undefined | null,
        defaultImg: string
    }): string => {
        if(!data?.site?.cdnUrl) return defaultImg;

        const condition = img && img !== 'nullnull' && img.length > 0;

        const existCDNServerUrl = data?.site?.cdnUrl
            && img?.includes(data?.site?.cdnUrl);

        if(existCDNServerUrl) return img as string;

        return condition
            ? data?.site?.cdnUrl + img
            : defaultImg;
    }


    return (
        <DefaultImageContext.Provider value={{
            defaultProfile,
            defaultNoImg
        }}>
            {children}
        </DefaultImageContext.Provider>
    )
}

export const useDefaultImage = () => {
    const context = useContext(DefaultImageContext);

    if(!context) throw new Error('useDefaultImage must be used within DefaultImageProvider');

    return context;
}
