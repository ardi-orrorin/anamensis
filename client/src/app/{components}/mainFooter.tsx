import Link from "next/link";

export default function Footer() {
    return (
        <div className={'h-16 max-h-16 min-h-14 flex flex-col gap-0.5 justify-center items-center bg-gray-500 text-white text-xs sm:text-sm'}
             data-testid={'footer'}
        >
            <span>
                Copyright © 2024 Ardi All Rights Reserved. Ver.{process.env.NEXT_PUBLIC_VERSION ?? '0.0.0'}
            </span>
            <Link href={'https://github.com/ardi-orrorin'}>GITHUB</Link>
        </div>
    )
}