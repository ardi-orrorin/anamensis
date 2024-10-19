import apiCall from "@/app/{commons}/func/api";
import {SMTP} from "@/app/system/smtp/{services}/types";
import {Common} from "@/app/{commons}/types/commons";
import {System} from "@/app/system/{services}/types";

const save = async ({body}: {body: System.Request<SMTP.Smtp>}): Promise<boolean> => {
    return await apiCall<boolean, System.Request<SMTP.Smtp>>({
        path: '/api/config/system',
        method: 'PUT',
        call: 'Proxy',
        body,
        isReturnData: true,
    });
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
