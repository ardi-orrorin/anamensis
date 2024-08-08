import {ResponseCookie} from "next/dist/compiled/@edge-runtime/cookies";

const cookieInit: Partial<ResponseCookie> = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/'
}

const loginConstants = {
    cookieInit
}

export default loginConstants;