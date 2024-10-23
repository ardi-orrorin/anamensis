import apiCall from "@/app/{commons}/func/api";
import {Common} from "@/app/{commons}/types/commons";
import StatusResponse = Common.StatusResponse;
import {System} from "@/app/system/{services}/types";

const getBoardIndexStatus = async (): Promise<System.JobStatus> => {
    return await apiCall<StatusResponse>({
        path: '/api/config/jobs/status',
        params: {jobName: 'board-index-job'},
        method: 'GET',
        isReturnData: true,
    }).then(res => res.message as System.JobStatus);
}

const resetBoardIndex = async () => {
    return await apiCall<StatusResponse>({
        path: '/api/config/board/reset-index',
        method: 'GET',
        isReturnData: true,
    })
}

const boardApiServices = {
    resetBoardIndex,
    getBoardIndexStatus,

}

export default boardApiServices;