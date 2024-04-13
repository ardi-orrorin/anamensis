import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {ErrorResponse} from "@/app/login/page";

export async function POST(req: NextRequest) {
    const {username, password} = await req.json();
    const url = process.env.NEXT_PUBLIC_SERVER + '/user/login';

    const geoLocation = await axios.get('https://geolocation-db.com/json')
        .then((res) => {
            return {
                countryCode: res.data.country_code,
                countryName: res.data.country_name,
                state: res.data.state,
                city: res.data.city,
                ipv4: res.data.IPv4,
                latitude: res.data.latitude,
                longitude: res.data.longitude
            };
        });
    return await axios.post(url, {username, password}, {
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': req.headers.get('User-Agent') || '',
            'Location': `${geoLocation.countryName}-${geoLocation.state}-${geoLocation.city}`
        }
    }).then((res) => {
        return new NextResponse(JSON.stringify(res.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'set-cookie': `${res.data.refreshToken}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`
            }
        });
    }).catch((err) => {
        const errResponse: ErrorResponse = {
            status: err.response.status,
            message: err.response.data.message,
            use: true
        }

        return new NextResponse(JSON.stringify(errResponse), {
            status: 500,
        });
    }).finally(() => {
        return NextResponse.error();
    });
}