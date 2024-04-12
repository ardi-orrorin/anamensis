import axios, {AxiosResponse} from "axios";
import {ExistProps, UserProps} from "@/app/signup/page";

export const postFetch = async (data: UserProps) => {
    return await axios.post(process.env.NEXT_PUBLIC_SERVER + '/user/signup', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export const postExistFetch = async (data: ExistProps) : Promise<AxiosResponse<UserResponseStatus>>   => {
    return await axios.post(process.env.NEXT_PUBLIC_SERVER + '/user/exist', data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}



interface UserResponseStatus {
    status: string;
    message: string;
}