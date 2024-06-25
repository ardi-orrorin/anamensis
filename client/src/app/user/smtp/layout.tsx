'use client';

import React from "react";
import SmtpList from "@/app/user/smtp/{components}/SmtpList";

export default async function Layout({
    children
}: {
    children: React.ReactNode
}) {


    return (
        <main className={'flex flex-col lg:flex-row w-full gap-5 duration-500'}>
            <div className={'w-full lg:w-1/2'}>
                {children}
            </div>
            <SmtpList />
        </main>
    );
}
