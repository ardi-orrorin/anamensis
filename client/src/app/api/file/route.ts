import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    console.log('formData', formData);
    return new NextResponse(JSON.stringify(formData), {
        headers: {
            'Content-Type': 'application/json'
        }
    });


    // try {
    //     const result = await axios.post('/api/file/upload', formData, {
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         }
    //     })
    //
    //     return new NextResponse(JSON.stringify(result.data), {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
    // } catch (e) {
    //     return new NextResponse(JSON.stringify(e), {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     });
    // }
}