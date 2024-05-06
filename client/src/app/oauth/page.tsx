'use client'
import {SessionProvider, signIn} from "next-auth/react";

export default function Page() {

    const onClickHandler= async () => {
        await signIn('server', {username: 'admin', password: 'admin'})
        console.log('clicked');
    }

    return (
        <div className={'flex flex-col gap-3'}>
            <SessionProvider>
                <h1>OAuth</h1>
                <p>
                    This is the OAuth page.
                </p>
                <button className={'bg-blue-400 text-white py-2 px-4'}
                        onClick={() => onClickHandler()}
                >
                    google login
                </button>
            </SessionProvider>
        </div>
    )
}