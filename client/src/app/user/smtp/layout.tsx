import SmtpCard, {SmtpCardProps} from "@/app/user/smtp/{components}/SmtpCard";
import {PageResponse} from "@/app/{commons}/types/commons";
import React from "react";
import apiCall from "@/app/{commons}/func/api";

export default async function Layout({
    children
}: {
    children: React.ReactNode
}) {

    const data: PageResponse<SmtpCardProps> = await getData();

    return (
        <main className={'flex flex-col lg:flex-row w-full gap-5 duration-500'}>
            <div className={'w-full lg:w-1/2'}>
                {children}
            </div>
            <div className={'w-full lg:w-1/2 flex flex-col gap-3'}>
                {
                    data.content
                        .sort((a, b) =>  b.id - a.id)
                        .map((smtp, index) => {
                        return (
                            <SmtpCard key={index} {...smtp} />
                        )
                    })
                }
            </div>
        </main>
    );
}

const getData = async (): Promise<PageResponse<SmtpCardProps>> => {
    return await apiCall<PageResponse<SmtpCardProps>>({
        path: '/api/user-config-smtp',
        method: 'GET',
        call: 'Server',
        setAuthorization: true
    })
    .then(res => {
        return res.data;
    });
}