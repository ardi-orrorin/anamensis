import axios, {AxiosResponse} from "axios";

export interface UserInfo {
    accessToken: string;
    refreshToken: string;
    roles: RoleType[];
}

export enum RoleType {
    ADMIN  = ('ADMIN'),
    USER   = ('USER'),
    GUEST  = ('GUEST'),
    MASTER = ('MASTER')
}

interface GeoLocation {
    countryCode: string;
    countryName: string;
    state: string;
    city: string;
    ipv4: string;
    latitude: number;
    longitude: number;
}

const fetchPost = async (data: any) : Promise<AxiosResponse<UserInfo>> => {
    const url = process.env.NEXT_PUBLIC_SERVER + '/user/login';

    const Location = JSON.parse(JSON.stringify(sessionStorage.getItem('geoLocation')));
    const city = Location ? JSON.parse(Location).city : 'Seoul';

    // @ts-ignore
    return await axios.post(url, data, {
        headers: {
            'Content-Type': 'application/json',
            'Location': city
        }
    }).then((res) => {
        sessionStorage.setItem("userInfo", JSON.stringify(res.data));
    });
}

export const getGeoLocation = async () => {
    const test = '/125.129.25.178'
    return await axios.get('https://geolocation-db.com/jsonp')
        .then((res) => {
            const geoLocation: GeoLocation = {
                countryCode: res.data.country_code,
                countryName: res.data.country_name,
                state: res.data.state,
                city: res.data.city,
                ipv4: res.data.IPv4,
                latitude: res.data.latitude,
                longitude: res.data.longitude
            };
            sessionStorage.setItem('geoLocation', JSON.stringify(geoLocation));
        });
}

export default fetchPost;