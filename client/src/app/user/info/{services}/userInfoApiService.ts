import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";
import {queryOptions} from "@tanstack/react-query";

const profile = () => {
    return queryOptions({
        queryKey: ['userProfile'],
        queryFn: async () => {
            return await apiCall<User.UserInfo>({
                path: '/api/user/info',
                method: 'GET',
                isReturnData: true,
            });
        },
    })
}


const setProfileImg = async (formdata: FormData) => {
    return await apiCall({
        path: '/api/user/info/profile-img',
        method: 'POST',
        body: formdata,
        contentType: 'multipart/form-data',
    });
}

const deleteProfileImg = async () => {
    return await apiCall({
        path: '/api/user/info/profile-img',
        method: 'DELETE',
    })
}

const userInfoApiService = {
    profile,
    setProfileImg,
    deleteProfileImg,
}

export default userInfoApiService;