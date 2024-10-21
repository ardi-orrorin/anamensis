import Link from "next/link";

export default function Footer() {
    return (
        <div className={'h-20 pt-3 flex flex-col gap-2 items-center bg-gray-800 text-white text-xs sm:text-sm'}
             data-testid={'footer'}
        >
            <span>
                Copyright © 2024 Ardi All Rights Reserved. Ver.{process.env.NEXT_PUBLIC_VERSION ?? '0.0.0'}
            </span>
            <div className={'w-full flex justify-center'}>
                <FooterLink {...{href: '/', value: 'HOME', rightBorder: true}} />
                <FooterLink {...{href: 'https://github.com/ardi-orrorin', value: 'GITHUB'}} />
            </div>
        </div>
    )
}

const FooterLink = ({href, value, rightBorder} : {href: string, value: string, rightBorder?: boolean}) => {
    return (
        <Link className={`px-3 text-gray-300 ${rightBorder && 'border-r'} border-solid border-gray-600 underline`}
                 href={href}
        >
            {value}
        </Link>
    )
}