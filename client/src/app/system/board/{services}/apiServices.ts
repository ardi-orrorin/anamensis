import apiCall from "@/app/{commons}/func/api";
import {Common} from "@/app/{commons}/types/commons";
import {System} from "@/app/system/{services}/types";
import StatusResponse = Common.StatusResponse;

const getBoardIndexStatus = async ({jobName}:{jobName: string}): Promise<System.JobStatus> => {
    return await apiCall<StatusResponse>({
        path: '/api/config/jobs/status',
        params: {jobName},
        method: 'GET',
        isReturnData: true,
    }).then(res => res.message as System.JobStatus);
}

const executeJob = async ({jobName}:{jobName: string}) => {
    return await apiCall<StatusResponse>({
        path: '/api/config/jobs',
        method: 'GET',
        params: {jobName},
        isReturnData: true,
    })
}

const boardApiServices = {
    executeJob,
    getBoardIndexStatus,

}

export default boardApiServices;