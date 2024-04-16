import {NextResponse} from "next/server";
import axios from "axios";
import {NextApiRequest} from "next";
import {cookies} from "next/headers";

export async function GET(
    req: NextApiRequest,
    {params}: {params: {id: string}}
){
    const url = process.env.NEXT_PUBLIC_SERVER + '/user-config-smtp/disabled/' + params.id;

    const token = cookies().get('accessToken') || cookies().get('refreshToken');

    const result = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token?.value}`
        }

    }).then(res => {
        return res.data;
    });

    return new NextResponse(JSON.stringify(result), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        }
    });

}