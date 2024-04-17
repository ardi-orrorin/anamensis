import SmtpCard, {SmtpCardProps} from "@/app/user/smtp/{components}/SmtpCard";
import axios from "axios";
import {PageResponse} from "@/app/{commons}/types/commons";
import {cookies} from "next/headers";
import React from "react";

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

    const token = cookies().get('accessToken') || cookies().get('refreshToken')

    const url = process.env.NEXT_PUBLIC_SERVER + '/user-config-smtp';

    return await axios.get(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token?.value}`
        }
    })
    .then(res => {
        return res.data;
    });

}