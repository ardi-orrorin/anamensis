import SmtpCard, {SmtpCardProps} from "@/app/user/smtp/{components}/SmtpCard";
import React from "react";
import apiCall from "@/app/{commons}/func/api";
import {Common} from "@/app/{commons}/types/commons";

const SmtpList = async () => {
    const data = await apiCall<Common.PageResponse<SmtpCardProps>>({
        path: '/api/user-config-smtp',
        method: 'GET',
        call: 'Server',
        setAuthorization: true,
        isReturnData: true
    })

    return (
        <div className={'w-full lg:w-1/2 flex flex-col gap-3'}>
            {
                data?.content?.length > 0
                ? data?.content?.sort((a, b) =>  b.id - a.id)
                    .map((smtp, index) => {
                        return (
                            <SmtpCard key={index} {...smtp} />
                        )
                    })
                : <div className={'flex justify-center items-center h-full'}>
                    등록된 Smtp가 없습니다.
                </div>

            }
        </div>
    )
}

export default SmtpList;