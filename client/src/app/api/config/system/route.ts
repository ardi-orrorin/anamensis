import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

// todo: add system config props
export function GET() {

    const config = {
        isSignUpEmailVerification: false,
        smtp : {

        }


    };

    return ExNextResponse({
        body: JSON.stringify(config),
        status: 200
    })
}