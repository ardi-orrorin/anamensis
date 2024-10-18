import apiCall from "@/app/{commons}/func/api";
import {SMTP} from "@/app/system/smtp/{services}/types";
import {Common} from "@/app/{commons}/types/commons";

const save = async ({body}: {body: SMTP.Smtp}): Promise<any> => {
    return await apiCall<any, SMTP.Smtp>({
        path: '/api/user/smtp',
        method: 'POST',
        call: 'Proxy',
        body,
    })
}

const getSmtpHistory = async ({req}: {req: URLSearchParams}): Promise<Common.PageResponse<SMTP.History>> => {
    return  await apiCall<Common.PageResponse<SMTP.History>, URLSearchParams>({
        path: '/api/smtp-push-history',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        params: req,
        isReturnData: true,
    })
}

const smtpApiServices = {
    save,
    getSmtpHistory,
}

export default smtpApiServices;
