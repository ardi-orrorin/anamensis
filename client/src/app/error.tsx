'use client';
import Image from "next/image";
import {useEffect} from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className={'min-h-screen w-full flex justify-center items-center'}>
            <Image src={'/error.gif'} alt={''} width={400} height={400} />
        </div>
    )
}
