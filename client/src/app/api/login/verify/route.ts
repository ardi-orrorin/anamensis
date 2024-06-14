import {NextRequest, NextResponse} from "next/server";
import axios from "axios";
import {LoginI} from "@/app/login/{services}/LoginProvider";
import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {ErrorResponse} from "@/app/login/page";

export async function POST(req: NextRequest){
    const user = await req.json() as LoginI;
    const url = process.env.NEXT_PUBLIC_SERVER + '/public/api/user/verify';

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

    console.log(geoLocation)

    try {
        const resData = await axios.post(url, user, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': req.headers.get('User-Agent') || '',
                'Ip': geoLocation.ipv4,
                'Location': `${geoLocation.countryName}-${geoLocation.state}-${geoLocation.city}`
            },
            withCredentials: true
        })
        const next = new NextResponse(JSON.stringify(resData.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const cookieInit: Partial<ResponseCookie> = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/'
        }

        next.cookies.set('next.access.token', resData.data.accessToken, {
            ...cookieInit,
            maxAge: resData.data.accessTokenExpiresIn / 1000
        });

        next.cookies.set('next.refresh.token', resData.data.refreshToken, {
            ...cookieInit,
            maxAge: resData.data.refreshTokenExpiresIn / 1000
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