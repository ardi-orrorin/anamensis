import apiCall from "@/app/{commons}/func/api";
import {queryOptions} from "@tanstack/react-query";
import {System} from "@/app/user/system/{services}/types";

const userRole = () => {
    return queryOptions({
        queryKey: ['userRole'],
        queryFn: async () => {
            return await apiCall<System.Role[]>({
                path: '/api/user/roles',
                method: 'GET',
                isReturnData: true,
            });
        },
        initialData: [],
        initialDataUpdatedAt: 1,
    })
}


const rootApiService = {
    userRole
}

export default rootApiService;