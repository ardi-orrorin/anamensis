import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {ErrorResponse} from "@/app/login/page";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";

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

    try {
        const res = await axios.post(url, {username, password}, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': req.headers.get('User-Agent') || '',
                'Location': `${geoLocation.countryName}-${geoLocation.state}-${geoLocation.city}`
            }
        })

        const next = new NextResponse(JSON.stringify(res.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const cookieInit: Partial<ResponseCookie> = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        }

        next.cookies.set('accessToken', res.data.accessToken, {
            ...cookieInit,
            maxAge: res.data.accessTokenExpiresIn / 1000
        });

        next.cookies.set('refreshToken', res.data.refreshToken, {
            ...cookieInit,
            maxAge: res.data.refreshTokenExpiresIn / 1000
        });

        return next;

    } catch (err: any) {
        const errResponse: ErrorResponse = {
            status: err.response.status,
            message: err.response.data.message,
            use: true
        }

        return new NextResponse(JSON.stringify(errResponse), {
            status: err.response.status,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    }
}