'use client';

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import React from "react";

const SizeSelect = () => {

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const onChangeSearchParams = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;

        const params = new URLSearchParams(searchParams.toString());
        params.set(name, value);

        router.push(pathname + '?' + params.toString());
    }

    return (
        <select className={'w-28 border border-solid border-gray-300 rounded-md text-sm px-3 py-1 outline-0'}
                name={'size'}
                defaultValue={searchParams.get('size') || '20'}
                onChange={onChangeSearchParams}
        >
            <option value={'10'}>10</option>
            <option value={'20'}>20</option>
            <option value={'30'}>30</option>
            <option value={'50'}>50</option>
            <option value={'100'}>100</option>
            <option value={'200'}>200</option>
        </select>
    )
}

export default React.memo(SizeSelect);