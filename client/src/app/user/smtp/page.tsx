'use client';

import {useState} from "react";

export default function Page() {

    const [hasTest, setHasTest] = useState<boolean>(false)
    return (
        <div className={'flex flex-col gap-3 px-2'}>
            <h1>SMTP 등록</h1>
            <input className={'w-full outline-0 focus:bg-blue-50 p-2 text-sm rounded duration-500'}
                   placeholder={'host을 입력하세요'}
            />
            <input className={'w-full outline-0 focus:bg-blue-50 p-2 text-sm rounded duration-500'}
                   placeholder={'port를 입력하세요'}
            />
            <input className={'w-full outline-0 focus:bg-blue-50 p-2 text-sm rounded duration-500'}
                   placeholder={'username을 입력하세요'}
            />
            <input className={'w-full outline-0 focus:bg-blue-50 p-2 text-sm rounded duration-500'}
                   placeholder={'fromEmail을 입력하세요'}
            />
            <input className={'w-full outline-0 focus:bg-blue-50 p-2 text-sm rounded duration-500'}
                   placeholder={'fromName을 입력하세요'}
            />
            <div className={'flex gap-3'}>
                <input type={'checkbox'} />
                <span className={'text-sm'}>SSL 사용</span>
            </div>
            <div className={'flex gap-3'}>
                <input type={'checkbox'} />
                <span className={'text-sm'}>사용</span>
            </div>
            <button className={'w-full bg-blue-300 text-white p-2 rounded duration-500 hover:bg-blue-400'}>
                {hasTest ? '등록' : '테스트'}
            </button>

        </div>
    )
}