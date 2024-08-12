import apiCall from "@/app/{commons}/func/api";
import {queryOptions} from "@tanstack/react-query";

const userRole = () => {
    return queryOptions({
        queryKey: ['userRole'],
        queryFn: async () => {
            return await apiCall({
                path: '/api/user/roles',
                method: 'GET',
                isReturnData: true,
            });
        },
    })
}


const rootApiService = {
    userRole
}

export default rootApiService;