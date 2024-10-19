'use client';

import {createContext, useContext} from "react";
import rootApiService from "@/app/{services}/rootApiService";
import {useQuery} from "@tanstack/react-query";

interface DefaultImageContextI {
    defaultProfile: (img: string | undefined | null) => string;
    defaultNoImg: (img: string | undefined | null) => string;
}
const DefaultImageContext = createContext<DefaultImageContextI>({} as DefaultImageContextI);

export const DefaultImageProvider = ({children}: {children: React.ReactNode}) => {

    const {data} = useQuery(rootApiService.getConfig());

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
        const condition = img && img !== 'nullnull' && img.length > 0;

        const existCDNServerUrl = data?.cdnServer
            && img?.includes(data?.cdnServer);

        if(existCDNServerUrl) return img as string;

        return condition
            ? data?.cdnServer + img
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
