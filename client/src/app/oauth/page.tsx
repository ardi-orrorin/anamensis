'use client'
import {SessionProvider} from "next-auth/react";

export default function Page() {

    return (
        <div className={'flex flex-col gap-3'}>
            <SessionProvider>
                <h1>OAuth</h1>
                <p>
                    This is the OAuth page.
                </p>
                <button className={'bg-blue-400 text-white py-2 px-4'}
                >
                    google login
                </button>
            </SessionProvider>
        </div>
    )
}