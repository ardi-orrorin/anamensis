'use client'

import React, {CSSProperties, useMemo} from "react";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import axios from "axios";
import Image from "next/image";

type OGType = {
    title       : string;
    description : string;
    image       : string;
    url         : string;
}
const LinkBlock = (props: BlockProps) => {
    const {value, onChangeValueHandler, onKeyUpHandler, onKeyDownHandler} = props;

    const link = useMemo(() => {
        try {
            if(value === '') return null;
            const ogMeta = JSON.parse(value as string);
            if(!ogMeta?.title) return null;
            return ogMeta;
        } catch (e) {
            return null;
        }

    },[value]);

    const customInputStyle: CSSProperties = {
        outline         : 'none',
        border          : 'none',
        width           : '100%',
        wordBreak       : 'break-all',
        color           : 'blue',
        padding         : '0.5rem',
        backgroundColor: 'rgba(230,230,230,0.2)',
        letterSpacing   : '0.03rem',
    };

    const linkPreviewStyle: CSSProperties = {
        display: 'flex',
        flex: '1 1',
        justifyContent: 'space-between',
        width: '100%',
        padding: '1rem',
        backgroundColor: 'rgba(230,230,230,0.2)',
        borderRadius: '0.5rem',
    }

    const onKeyupChangeHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key !== 'Enter') return ;

        const urlRegex = new RegExp(/(http(s)?:\/\/)([a-z0-9\w]+\.*)+[a-z0-9]{2,4}/gi);

        if(urlRegex.test(value)){
            await axios.get('/api/link/og', {
                params: {
                    url: value
                }
            })
            .then(res => {

                const htmlDoc = new DOMParser().parseFromString(res.data, 'text/html');
                const ogTitle = htmlDoc.querySelector('meta[property="og:title"]')?.getAttribute('content');
                const ogDescription = htmlDoc.querySelector('meta[property="og:description"]')?.getAttribute('content');
                const ogImage = htmlDoc.querySelector('meta[property="og:image"]')?.getAttribute('content');

                const data = {
                    title: ogTitle || value.split('/')[2],
                    description: ogDescription || '',
                    image: ogImage || 'http://' + process.env.NEXT_PUBLIC_DOMAIN + '/noimage.jpg',
                    url: value || '/',
                };

                if (onChangeValueHandler) {
                    onChangeValueHandler(JSON.stringify(data));
                }
            })
            .then(() => {
                onKeyUpHandler && onKeyUpHandler(e);
            })
            .catch(err => {
                alert('링크를 가져오는데 실패했습니다.');
            })

        }
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChangeValueHandler) {
            onChangeValueHandler(e.target.value);
        }
    }

    return (
        <>
            {
                !link && !link?.title
                ? <input style={customInputStyle}
                       value={value as string}
                       onChange={onChangeHandler}
                       onKeyUp={onKeyupChangeHandler}
                       onKeyDown={onKeyDownHandler}

                />
                : <a style={linkPreviewStyle}
                     href={(link as OGType).url}
                     target={'_blank'}>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between', padding:'1rem'}}>
                        <p style={{fontSize: '1.6rem'}}>{(link as OGType).title}</p>
                        <p style={{fontSize: '1rem', wordBreak: 'break-all', color: 'gray'}}
                        >{(link as OGType).description}</p>
                    </div>
                    <img style={{width: '120px', height:'120px'}}
                         src={(link as OGType).image} alt=""
                    />
                </a>
            }

        </>
    )
}

export default LinkBlock;