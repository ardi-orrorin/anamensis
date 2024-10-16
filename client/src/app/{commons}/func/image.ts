export const defaultProfile = (img: string | undefined | null) =>
    defaultImage({img, defaultImg: '/static/default_profile.jpg'});

export const defaultNoImg = (img: string | undefined | null) =>
    defaultImage({img, defaultImg: '/noimage.jpg'});



const defaultImage = ({
    img, defaultImg
}:{
    img: string | undefined | null,
    defaultImg: string
}): string => {
    const condition = img && img !== 'nullnull' && img.length > 0;

    const existCDNServerUrl = process.env.NEXT_PUBLIC_CDN_SERVER
        && img?.includes(process.env.NEXT_PUBLIC_CDN_SERVER);

    if(existCDNServerUrl) return img as string;

    return condition
            ? process.env.NEXT_PUBLIC_CDN_SERVER + img
            : defaultImg;
}
