'use client'

import React, {CSSProperties, useEffect} from "react";
import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import apiCall from "@/app/{commons}/func/api";

type OGType = {
    title       : string;
    description : string;
    image       : string;
    url         : string;
}

const LinkBlock = (props: ExpendBlockProps) => {
    const {
        seq, blockRef,
        value, type,
        isView, hash,
        onChangeValueHandler, onKeyUpHandler,
        onKeyDownHandler, onMouseEnterHandler,
        onFocusHandler, onChangeExtraValueHandler,
    }: ExpendBlockProps = props;

    const extraValue = props.extraValue as OGType;

    useEffect(() => {
        if(!value?.includes('https://')) onChangeValueHandler!('https://' + value);
    },[])


    const onKeyDownChangeHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return ;

        const urlRegex = new RegExp(/(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,5}/gi);

        try {
            if(!urlRegex.test(value)) return alert('링크 형식이 올바르지 않습니다.');
            const params = {
                url: value
            }

            const res = await apiCall<any>({
                path: '/api/link/og',
                method: 'GET',
                params,
                isReturnData: true,
            });

            const htmlDoc = new DOMParser().parseFromString(res, 'text/html');
            const ogTitle = htmlDoc.querySelector('meta[property="og:title"]')?.getAttribute('content');
            const ogDescription = htmlDoc.querySelector('meta[property="og:description"]')?.getAttribute('content');
            const ogImage = htmlDoc.querySelector('meta[property="og:image"]')?.getAttribute('content');

            const data = {
                title: ogTitle || value.split('/')[2],
                description: ogDescription || '',
                image: ogImage || '',
            };

            onChangeExtraValueHandler!(data);

        } catch (e) {
            alert('링크를 가져오는데 실패했습니다.');
        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChangeValueHandler!(e.target.value);
    }

    return (
        <div id={`block-${hash}`}
             className={['w-full'].join(' ')}
             aria-roledescription={type}
        >
            {
                !extraValue || !extraValue.title
                ? <input className={'w-full p-2 break-all text-blue-700 outline-0'}
                         style={{backgroundColor: isView? "white" : 'rgba(230,230,230,0.2)'}}
                         value={value}
                         placeholder={'링크를 입력해주세요(https, http 포함). https://www.example.com'}
                         onChange={onChangeHandler}
                         onKeyUp={onKeyUpHandler}
                         onKeyDown={onKeyDownChangeHandler}
                         onFocus={onFocusHandler}
                         disabled={isView}
                         ref={el => {blockRef!.current[seq] = el}}
                />
                : <a className={'flex justify-between w-full p-4 gap-2'}
                     style={{backgroundColor: 'rgba(230,230,230,0.2)'}}
                     href={value}
                     target={'_blank'}
                     onMouseEnter={onMouseEnterHandler}
                     aria-roledescription={'object'}
                     ref={el => {blockRef!.current[seq] = el}}
                >
                    <div className={'flex flex-col gap-1 justify-between p-1'}
                    >
                        <p style={{fontSize: '1.3rem'}}
                        >{extraValue.title || value.split('/')[2]}
                        </p>
                        <p className={'text-gray-600 break-all'}
                           style={{fontSize: '0.7rem'}}
                        >{extraValue.description || '내용 없음'}</p>
                    </div>
                    <img className={'min-w-[100px] w-[30%] h-[80px] rounded object-cover'}
                         src={extraValue.image || 'http://' + process.env.NEXT_PUBLIC_DOMAIN + '/noimage.jpg'} alt=""
                    />
                </a>
            }
        </div>
    )
}

export default LinkBlock;