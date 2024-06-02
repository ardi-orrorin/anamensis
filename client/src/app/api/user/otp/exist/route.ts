import apiCall from "@/app/{commons}/func/api";

export async function GET(){
    const res = await apiCall<any>({
        path: '/api/otp/exist',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
    });

    return new Response(JSON.stringify(res.data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}