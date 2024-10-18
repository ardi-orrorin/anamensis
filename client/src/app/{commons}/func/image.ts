// export const defaultProfile = (img: string | undefined | null) =>
//     defaultImage({img, defaultImg: '/static/default_profile.jpg'});
//
// export const defaultNoImg = (img: string | undefined | null) =>
//     defaultImage({img, defaultImg: '/noimage.jpg'});
//
// const defaultImage = ({
//     img, defaultImg
// }:{
//     img: string | undefined | null,
//     defaultImg: string
// }): string => {
//     const condition = img && img !== 'nullnull' && img.length > 0;
//
//     const cdnServer = '/files';
//
//     const existCDNServerUrl = cdnServer
//         && img?.includes(cdnServer);
//
//     if(existCDNServerUrl) return img as string;
//
//     return condition
//             ? cdnServer + img
//             : defaultImg;
// }
