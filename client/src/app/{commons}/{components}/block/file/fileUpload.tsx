'use client';

import {CSSProperties, useContext, useRef, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import axios from "axios";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import TempFileProvider from "@/app/board/{services}/TempFileProvider";


export type FileUploadProps = {
    onUploadFileUrl: (url: string) => void;
    isImage?: boolean;
} & BlockProps;

export default function FileUpload (props: FileUploadProps) {
    const {onUploadFileUrl, isImage} = props;

    const useFileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const {setTempFiles} = useContext(TempFileProvider);

    const customStyle: CSSProperties = {
        width            : '100%',
        height           : '4rem',
        outline          : 'none',
        backgroundColor  : 'rgba(250,250,250, 0.3)',
    }

    const onClick = () => {
        if(!useFileInputRef.current) return ;
        useFileInputRef.current.click();
    }

    const onChangeFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files || e.target.files.length === 0) return ;

        const formData = new FormData();
        const fileContent = {
            tableCodePk: 2
        }

        const blob = new Blob([JSON.stringify(fileContent)], {type: 'application/json'})
        formData.append('file', e.target.files[0]);
        formData.append('fileContent', blob);
        setLoading(true);

        await axios.post('/api/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if(!res.data) return ;
            setTempFiles(prevState => [
                ...prevState,
                {...res.data}
            ]);

            const url = res.data.filePath + res.data.fileName;
            onUploadFileUrl(url);
        })
        .finally(() => {
            setLoading(false);
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
                   accept={ isImage ? 'image/*' : '*/*'}
            />
        </>
    )
}