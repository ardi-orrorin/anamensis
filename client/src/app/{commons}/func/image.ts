export const defaultProfile = (img: string | undefined | null) => {
    const condition = img && img !== 'nullnull' && img.length > 0;
    return condition
        ? process.env.NEXT_PUBLIC_CDN_SERVER + img
        : '/static/default_profile.jpg';
}

export const defaultNoImg = (img: string | undefined | null) => {
    const condition = img && img !== 'nullnull' && img.length > 0;

    return condition
        ? process.env.NEXT_PUBLIC_CDN_SERVER + img
        : '/noimage.jpg';
}

