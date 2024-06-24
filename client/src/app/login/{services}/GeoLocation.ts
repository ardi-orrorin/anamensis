
import axios from "axios";

export type GeoLocationType = {
    countryCode: string;
    countryName: string;
    state: string;
    city: string;
    ipv4: string;
    latitude: number;
    longitude: number;
}
export const getGeoLocation = async (clientIp: string | undefined | null): Promise<GeoLocationType> => {
    const res = await axios.get('https://geolocation-db.com/json/' + (clientIp ?? ''))
        .then((res) => res.data);

    return {
        countryCode: res.country_code,
        countryName: res.country_name,
        state: res.state,
        city: res.city,
        ipv4: res.IPv4,
        latitude: res.latitude,
        longitude: res.longitude
    }
}