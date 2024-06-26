'use client';

import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import SmtpCard, {SmtpCardProps} from "@/app/user/smtp/{components}/SmtpCard";
import React, {useEffect, useState} from "react";
import {PageResponse} from "@/app/{commons}/types/commons";
import apiCall from "@/app/{commons}/func/api";
import {preload} from "swr";

const SmtpList = () => {
    const [data, setData] = useState<PageResponse<SmtpCardProps>>({} as PageResponse<SmtpCardProps>);

    const [loading, setLoading] = useState(true);

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
    .finally(() => {
        setLoading(false);
    });

    return (
        <div className={'w-full lg:w-1/2 flex flex-col gap-3'}>
            {
                loading
                    ? <LoadingSpinner size={20} />
                    : data?.content
                        ?.sort((a, b) =>  b.id - a.id)
                        .map((smtp, index) => {
                            return (
                                <SmtpCard key={index} {...smtp} />
                            )
                        })
            }
        </div>
    )
}

export default SmtpList;