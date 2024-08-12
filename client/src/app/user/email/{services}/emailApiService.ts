import apiCall from "@/app/{commons}/func/api";
import {queryOptions} from "@tanstack/react-query";
import {User} from "@/app/login/{services}/types";

const userInfo = () => {
    return queryOptions({
        queryKey: ['userInfo'],
        queryFn: async () => {
            return await apiCall<User.UserInfo>({
                path: '/api/user/info',
                method: 'GET',
                isReturnData: true,
            })
        },
    })
}

const toggleSAuth = async (data: User.AuthProps) => {
    return await apiCall<User.UserInfo, User.AuthProps>({
        path: '/api/user/email',
        method: 'PUT',
        body: data,
        isReturnData: true,
    })
}


const emailApiService = {
    userInfo,
    toggleSAuth,
}

export default emailApiService;