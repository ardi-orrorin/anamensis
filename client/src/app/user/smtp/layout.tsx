'use client';

import SmtpCard from "@/app/user/smtp/{components}/SmtpCard";

export default function Layout({
   children
}: {
children: React.ReactNode
}) {
    return (
        <main className={'flex w-full'}>
            <div className={'w-1/2'}>
                {children}
            </div>
            <div className={'w-1/2'}>
                <SmtpCard />
            </div>
        </main>
    );
}