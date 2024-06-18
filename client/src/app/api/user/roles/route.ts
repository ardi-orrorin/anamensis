import ExNextResponse from "@/app/{commons}/func/ExNextResponse";

export function GET(){
    return ExNextResponse({
        body: '',
        status: 200,
        isRoles: true,
    })
}