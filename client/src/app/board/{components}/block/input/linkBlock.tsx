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
        value,
        isView, hash,
        onChangeValueHandler, onKeyUpHandler,
        onKeyDownHandler, onMouseEnterHandler,
        onFocusHandler, onChangeExtraValueHandler,
    } = props;

    const extraValue = props.extraValue as OGType;

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
        backgroundColor : isView? "white" : 'rgba(230,230,230,0.2)',
        letterSpacing   : '0.03rem',
    };

    const linkPreviewStyle: CSSProperties = {
        display         : 'flex',
        flex            : '1 1',
        justifyContent  : 'space-between',
        width           : '100%',
        padding         : '1rem',
        backgroundColor : isView? "white" : 'rgba(230,230,230,0.2)',
        gap             : '0.5rem',
    }

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
            // onKeyUpHandler!(e);

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
                !extraValue || !extraValue.title
                ? <input style={customInputStyle}
                         value={value}
                         placeholder={'링크를 입력해주세요(https, http 포함). https://www.example.com'}
                         onChange={onChangeHandler}
                         onKeyUp={onKeyUpHandler}
                         onKeyDown={onKeyDownChangeHandler}
                         onFocus={onFocusHandler}
                         disabled={isView}
                         ref={el => {blockRef!.current[seq] = el}}
                />
                : <a style={linkPreviewStyle}
                     href={value}
                     target={'_blank'}
                     onMouseEnter={onMouseEnterHandler}
                     aria-roledescription={'object'}
                     ref={el => {blockRef!.current[seq] = el}}
                >
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'space-between', padding:'0.6rem'}}>
                        <p style={{fontSize: '1.3rem'}}
                        >{extraValue.title || value.split('/')[2]}
                        </p>
                        <p style={{fontSize: '0.7rem', wordBreak: 'break-all', color: 'gray'}}
                        >{extraValue.description || '내용 없음'}</p>
                    </div>
                    <img style={{minWidth: '100px', width: '30%', height:'80px', borderRadius: '0.2rem', objectFit: 'cover'}}
                         src={extraValue.image || 'http://' + process.env.NEXT_PUBLIC_DOMAIN + '/noimage.jpg'} alt=""
                    />
                </a>
            }
        </div>
    )
}

export default LinkBlock;