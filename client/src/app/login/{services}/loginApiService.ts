import {queryOptions} from "@tanstack/react-query";
import apiCall from "@/app/{commons}/func/api";
import {User} from "@/app/login/{services}/types";


const verify = (user: User.Login) => {
    return queryOptions({
        queryKey: ['loginVerify'],
        queryFn: async () => {
            return await apiCall<User.LoginResponse, User.Login>({
                path: '/api/login/verify',
                method: 'POST',
                body: user,
                call: 'Proxy'
            })
        },
    })
}

const loginApiService = {
    verify,
}

export default loginApiService;