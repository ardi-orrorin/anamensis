export const defaultProfile = (img: string | undefined | null) => {
    const condition = img && img !== 'nullnull';

    const profile =  condition ? img : '/default_profile.jpg';
    return process.env.NEXT_PUBLIC_CDN_SERVER + profile;
}

export const defaultNoImg = (img: string | undefined | null) => {
    const condition = img && img !== 'nullnull';

    const profile =  condition ? img : '/noimage.jpg';
    return process.env.NEXT_PUBLIC_CDN_SERVER + profile;
}

