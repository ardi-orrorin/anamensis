export default function Footer() {
    return (
        <div className={'h-14 flex flex-col gap-0.5 justify-center items-center bg-blue-400 text-white text-xs sm:text-sm'}>
            <span>
                Copyright © 2024 Anamensis All Rights Reserved.
            </span>
            <span>
                Anamensis Version : {process.env.NEXT_PUBLIC_VERSION || '0.0.0'}
            </span>
        </div>
    )
}