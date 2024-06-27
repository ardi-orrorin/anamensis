'use client';

import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import SmtpCard, {SmtpCardProps} from "@/app/user/smtp/{components}/SmtpCard";
import React, {useEffect, useState} from "react";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import {preload} from "swr";

const SmtpList = () => {
    const [data, setData] = useState<PageResponse<SmtpCardProps>>({} as PageResponse<SmtpCardProps>);

    preload('/api/user/smtp/list', async () => {
        return await apiCall<PageResponse<SmtpCardProps>>({
            path: '/api/user/smtp/list',
            method: 'GET',
            isReturnData: true,
        })
    })
    .then(res => {
        setData(res);
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