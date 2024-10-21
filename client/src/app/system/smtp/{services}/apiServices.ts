import apiCall from "@/app/{commons}/func/api";
import {SystemSMTP} from "@/app/system/smtp/{services}/types";
import {Common} from "@/app/{commons}/types/commons";

const getSmtpHistory = async ({req}: {req: URLSearchParams}): Promise<Common.PageResponse<SystemSMTP.History>> => {
    return  await apiCall<Common.PageResponse<SystemSMTP.History>, URLSearchParams>({
        path: '/api/smtp-push-history',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        params: req,
        isReturnData: true,
    })
}

const smtpApiServices = {
    getSmtpHistory,
}

export default smtpApiServices;
