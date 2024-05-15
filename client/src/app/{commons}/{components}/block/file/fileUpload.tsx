'use client';

import {CSSProperties, useRef, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import axios from "axios";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";


export type FileUploadProps = {
    onUploadFileUrl: (url: string) => void;
} & BlockProps;

export default function FileUpload (props: FileUploadProps) {
    const {onUploadFileUrl} = props;

    const useFileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const customStyle: CSSProperties = {
        width            : '100%',
        height           : '4rem',
        outline          : 'none',
        border           : '1px solid',
        borderRadius     : '0.4rem',
        borderColor      : 'rgba(100, 100, 100, 1)',
        color            : 'rgba(100, 100, 100, 1)',
        backgroundColor  : 'rgba(250,250,250, 1)',
    }

    const onClick = () => {
        if(!useFileInputRef.current) return ;
        useFileInputRef.current.click();
    }

    const onChangeFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || e.target.files.length === 0) return ;

        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        setLoading(true);

        await axios.post('/api/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log('res', res);
            onUploadFileUrl('sdfs');
        })
        .finally(() => {
            setTimeout(() => {
                setLoading(false);
            },2000);
        });
    }

    return (
        <>
            <div className={'w-full'}>
                <button style={customStyle}
                        onClick={onClick}
                >
                    {
                        loading
                        ? <LoadingSpinner size={40} />
                        : <p>파일첨부</p>
                    }
                </button>
            </div>
            <input type={'file'}
                   ref={useFileInputRef}
                   onChange={onChangeFileHandler}
                   hidden={true}
                   multiple={false}
            />
        </>
    )
}