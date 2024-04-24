'use client';
import Image from "next/image";

const Error = () => {
    return (
        <div className={'min-h-screen w-full flex justify-center items-center'}>
            <Image src={'/error.gif'} alt={''} width={400} height={400} />
        </div>
    )
}

export default Error;