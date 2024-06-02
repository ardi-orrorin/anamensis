'use client';

import {CSSProperties, useContext, useRef, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import axios from "axios";
import {BlockProps} from "@/app/board/{components}/block/type/Types";
import TempFileProvider from "@/app/board/{services}/TempFileProvider";

export type FileUploadProps = {
    onUploadFileUrl: (url: string) => void;
    isImage?: boolean;
} & BlockProps;

export default function FileUpload (props: FileUploadProps) {
    const {onUploadFileUrl, isImage, onMouseEnterHandler} = props;

    const useFileInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
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
        const formData = new FormData();
        const file = e.target.files && e.target.files[0];

        if(!file) return ;

        isImage
        ? await uploadImage(e, formData, file)
        : await uploadFile(e, formData, file);
    }

    const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, formData: FormData, file: File) => {
        let eventSource ;
        try {
            const hash = await axios.get('/api/file/addr')
                .then((res) => res.data);

            formData.append('file', file);

            const root = process.env.NEXT_PUBLIC_SERVER + '/public/api/files/upload/';

            setLoading(true);

            eventSource = new EventSource(root + hash);
            eventSource.onmessage = (e) => {
                const data: {hash:string, message: string} = JSON.parse(e.data);
                setProgress(Number(data.message));
            }

            const result = await axios.post(root + hash, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            eventSource.close();

            onUploadFileUrl(result.data.filePath + result.data.fileName);
        } catch (e) {
            console.error(e);
        } finally {
            if(eventSource) eventSource.close();
            setLoading(false);
        }
    }

    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, formData: FormData, file: File) => {
        const fileContent = {
            tableCodePk: 2
        }

        const blob = new Blob([JSON.stringify(fileContent)], {type: 'application/json'})

        formData.append('file', file);
        formData.append('fileContent', blob);

        setLoading(true);

        await axios.post('/api/file/img', formData, {
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
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <>
            <div className={'w-full'}
                 onMouseEnter={onMouseEnterHandler}
                 aria-roledescription={'object'}
            >
                <button style={customStyle}
                        onClick={onClick}
                >
                    {
                        isImage && loading
                        && <LoadingSpinner size={40} />
                    }
                    {
                        !isImage && loading
                        && <div>
                            <p>{progress}%</p>
                            <p>Uploading... </p>
                      </div>
                    }
                    {
                        !loading &&
                        <p>파일첨부</p>
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