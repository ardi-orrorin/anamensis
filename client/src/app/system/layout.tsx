'use client';

import React from "react";
import SystemContents from "@/app/system/{components}/systemContents";
import SystemLeftNavBar from "@/app/system/{components}/systemLeftNavBar";

export default function Layout({children}: {children: React.ReactNode}) {

    return (
        <main className={'flex items-start max-h-full'}>
            <SystemLeftNavBar />
            <SystemContents>
                {children}
            </SystemContents>
        </main>
    )
}