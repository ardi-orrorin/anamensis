'use client'

import React, {CSSProperties, useEffect, useMemo} from "react";
import {BlockProps} from "@/app/board/{components}/block/type/Types";
import axios from "axios";
import localFont from "next/dist/compiled/@next/font/dist/local";
import apiCall from "@/app/{commons}/func/api";

type OGType = {
    title       : string;
    description : string;
    image       : string;
    url         : string;
}

const LinkBlock = (props: BlockProps) => {
    const {
        seq, blockRef,
        value, extraValue,
        isView, hash,
        onChangeValueHandler, onKeyUpHandler,
        onKeyDownHandler, onMouseEnterHandler,
        onFocusHandler, onChangeExtraValueHandler,
    } = props;

    useEffect(() => {
        if(!value?.includes('https://')) onChangeValueHandler!('https://' + value);
    },[])

    const customInputStyle: CSSProperties = {
        outline         : 'none',
        border          : 'none',
        width           : '100%',
        wordBreak       : 'break-all',
        color           : 'blue',
        padding         : '0.5rem',
        backgroundColor : 'rgba(230,230,230,0.2)',
        letterSpacing   : '0.03rem',
    };

    const linkPreviewStyle: CSSProperties = {
        display         : 'flex',
        flex            : '1 1',
        justifyContent  : 'space-between',
        width           : '100%',
        padding         : '1rem',
        backgroundColor : 'rgba(230,230,230,0.2)',
    }

    const onKeyupChangeHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return ;

        const urlRegex = new RegExp(/(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi);

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

            onKeyUpHandler!(e);

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
        >
            {
                !extraValue || !(extraValue as OGType).title
                ? <input style={customInputStyle}
                         value={value}
                         placeholder={'링크를 입력해주세요(https, http 포함). https://www.example.com'}
                         onChange={onChangeHandler}
                         onKeyUp={onKeyupChangeHandler}
                         onKeyDown={onKeyDownHandler}
                         onFocus={onFocusHandler}
                         ref={el => blockRef!.current[seq] = el}
                />
                : <a style={linkPreviewStyle}
                     href={value}
                     target={'_blank'}
                     onMouseEnter={onMouseEnterHandler}
                >
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'space-between', padding:'0.6rem'}}>
                        <p style={{fontSize: '1.3rem'}}
                        >{(extraValue as OGType).title || value.split('/')[2]}
                        </p>
                        <p style={{fontSize: '0.7rem', wordBreak: 'break-all', color: 'gray'}}
                        >{(extraValue as OGType).description || '내용 없음'}</p>
                    </div>
                    <img style={{minWidth: '200px', width: '200px', height:'80px', borderRadius: '0.2rem', objectFit: 'cover'}}
                         src={(extraValue as OGType).image || 'http://' + process.env.NEXT_PUBLIC_DOMAIN + '/noimage.jpg'} alt=""
                    />
                </a>
            }
        </div>
    )
}

export default LinkBlock;