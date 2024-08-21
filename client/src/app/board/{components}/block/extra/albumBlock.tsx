import {ExpendBlockProps, FileContentType} from "@/app/board/{components}/block/type/Types";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBorderAll, faImage} from "@fortawesome/free-solid-svg-icons";
import AlbumProvider, {AlbumToggleType} from "@/app/board/{components}/block/extra/providers/albumProvier";
import apiCall from "@/app/{commons}/func/api";
import {FileContentI} from "@/app/api/file/img/route";
import ImageView from "@/app/board/{components}/block/extra/{components}/ImageView";
import Thumbnail from "@/app/board/{components}/block/extra/{components}/thumbnail";
import Slide from "@/app/board/{components}/block/extra/{components}/slide";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import {AxiosError} from "axios";
import {usePendingFiles} from "@/app/board/[id]/{hooks}/usePendingFiles";
import boardApiService from "@/app/board/{services}/boardApiService";

export type ImageShowProps = {
    defaultIndex: number;
    images: string[];
    mode: 'slide' | 'fade' | 'card' | 'thumbnail';
}

export type ProgressType = {
    size: number;
    progress: number;
}

const MAX_IMAGE = 30;
const MAX_CONCURRENT = 30;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const UPLOAD_WORKER = 2

const AlbumBlock = (props: ExpendBlockProps) => {
    const {
        hash, value
        , onChangeExtraValueHandler
        , isView
        , type
    }: ExpendBlockProps = props;

    const extraValue = props.extraValue as ImageShowProps;
    const {
        setWaitUploadFiles,
        deleteImage,
    } = usePendingFiles();

    const {board, isNewBoard} = useContext(BoardProvider);
    const {title, isPublic, membersOnly} = board?.data;

    const [viewMode, setViewMode] = useState<string>(extraValue?.mode || 'thumbnail');
    const [uploadProgress, setUploadProgress] = useState<ProgressType>({
        size: 0,
        progress: 0,
    } as ProgressType);

    const [albumToggle, setAlbumToggle] = useState<AlbumToggleType>({
        viewImage: '',
        viewToggle: false,
    } as AlbumToggleType);

    const [waitUpload, setWaitUpload] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(!onChangeExtraValueHandler) return;

        if(extraValue?.images?.length > 0) return;

        onChangeExtraValueHandler({
            defaultIndex: 0,
            images: [],
            mode: 'thumbnail',
        } as ImageShowProps);
    },[]);

    const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;
        if(files.length > MAX_CONCURRENT) {
            alert(`한번에 최대 ${MAX_CONCURRENT}개까지 업로드 가능합니다.`);
            e.currentTarget.value = '';
            return;
        }
        if(files.length + extraValue.images.length > MAX_IMAGE) {
            alert(`이미지는 최대 ${MAX_IMAGE}개까지 가능합니다.`);
            return;
        }

        if(files.length === 0) return;

        const fileContent: FileContentType = {
            tableCodePk: 2,
            categoryPk: 5,
        }

        const uploadedImages: string[] = [];

        const progress: number[] = [];

        let size = 0;

        for(const file of files) {
            file.size > MAX_FILE_SIZE || size++;
        }

        setWaitUpload(true);
        setUploadProgress({
            size,
            progress: 0,
        });


        for(let i = 0 ; i < files.length ; i += UPLOAD_WORKER) {
            const list = Array.from({length: UPLOAD_WORKER})
                .map((_, index) => upload(files[i + index], fileContent, uploadedImages, size, progress))

            await Promise.allSettled(list);
        }

        e.target.value = '';
        setWaitUpload(false);
    }

    const upload = async (file: File, fileContent: FileContentType, uploadedImages: string[], size: number, progress: number[]) => {
        if(file.size > MAX_FILE_SIZE) return;

        const blob = new Blob([JSON.stringify(fileContent)], {type: 'application/json'})

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileContent', blob);

        const call = async () : Promise<any> => {
            try {
                return await apiCall<FileContentI>({
                    path: '/api/file/img',
                    method: 'POST',
                    body: formData,
                    contentType: 'multipart/form-data',
                    isReturnData: true,
                    timeout: 5 * 60 * 1000,
                });
            } catch (e) {
                const err = e as AxiosError;
                return call()
            }
        }

        const res = await call();

        if(!res) return;

        const {id, filePath, fileName} = res;

        setWaitUploadFiles((prev) => {
            return [...prev, {id, filePath, fileName}];
        });


        if(!extraValue) return;

        uploadedImages.push(filePath + fileName);

        progress.push(1);

        setUploadProgress({ size, progress: progress.length});

        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            ...extraValue,
            images: [...extraValue.images, ...uploadedImages],
        } as ImageShowProps);
    }


    const onChangeModeHandler = useCallback((mode: string) => {
        setViewMode(mode);
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            ...extraValue,
            mode: mode,
        } as ImageShowProps);
    },[extraValue, isView, title, membersOnly, isPublic]);


    const onChaneDefaultIndexHandler = useCallback((index: number) => {
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            ...extraValue,
            defaultIndex: index,
        } as ImageShowProps);
    },[extraValue, isView, title, membersOnly, isPublic]);

    const deleteImageHandler = async (absolutePath: string, index: number) => {
        try {
            isNewBoard
            && await boardApiService.deleteFile(absolutePath);

            if(!onChangeExtraValueHandler) return;

            onChangeExtraValueHandler({
                ...extraValue,
                images: extraValue.images.filter(image => image !== absolutePath),
                defaultIndex: extraValue.defaultIndex === index ? 0 : extraValue.defaultIndex,
            } as ImageShowProps);

            deleteImage(absolutePath);

        } catch (e) {
            console.error(e);
        }
    }

    const componentProps = useMemo(() => ({
        images       : extraValue?.images || [],
        isView       : isView || false,
        defaultIndex : extraValue?.defaultIndex ?? 0,
        deleteImageHandler,
        onChaneDefaultIndexHandler,
    }),[isView, extraValue, title]);

    const modes = useMemo(() => [
        {icon: faBorderAll, mode: 'thumbnail', component: <Thumbnail {...componentProps}/>},
        {icon: faImage, mode: 'slide', component: <Slide {...componentProps} />},
    ], [componentProps]);

    const modeComponent = useMemo(()=>
        modes.map((mode, index) => {
            return (
                <button key={'mode' + index}
                        className={[
                            'w-16 h-8 rounded border border-solid border-gray-200',
                            viewMode === mode.mode ? 'bg-gray-800' : 'bg-white'
                        ].join(' ')}
                        onClick={() => onChangeModeHandler(mode.mode)}
                >
                    <FontAwesomeIcon className={viewMode === mode.mode ? 'text-white' : ''}
                                     icon={mode.icon}
                    />
                </button>
            )
        })
    ,[modes])

    const modeView = useMemo(() =>
        modes.find(mode =>
            mode.mode === viewMode
        )?.component
    ,[modes])

    return (
        <AlbumProvider.Provider value={{albumToggle, setAlbumToggle}}>
        <div id={`block_${hash}`}
             className={'flex w-full flex-col gap-5'}
             aria-roledescription={type}
             ref={el => {
                 if(!props.blockRef?.current) return;
                 props!.blockRef!.current[props.seq] = el
             }}
        >
            {
                !isView
                && extraValue?.images?.length < MAX_IMAGE
                && <div className={'w-full flex justify-center'}>
                    <button className={'w-full flex flex-col justify-center items-center gap-3 py-4 px-2 bg-white rounded border border-solid border-gray-200'}
                            disabled={waitUpload}
                            onClick={() => inputRef.current?.click()}
                    >
                        <p>
                            {
                                uploadProgress?.size !== 0
                                && uploadProgress?.size === uploadProgress?.progress
                                ? '이미지 업로드 완료'
                                : '이미지 업로드 진행중 (최대 30개)'
                            }
                        </p>
                        {
                            uploadProgress.size > 0
                            && extraValue?.images?.length > 0
                            && extraValue?.images?.length < MAX_IMAGE
                            && <div className={'flex flex-col w-full gap-3'}>
                                <div className={'w-full h-2 bg-gray-200'}>
                                  <div className={'h-2 bg-blue-400 duration-500 rounded-xl'}
                                       style={{width: `${(uploadProgress.progress / uploadProgress.size) * 100}%`}}
                                  />
                                </div>
                                <div className={'flex justify-center text-sm'}>
                                  <span>업로드 중 : {uploadProgress.progress} / {uploadProgress.size}</span>
                                </div>
                                <div className={'flex justify-center text-sm'}>
                                  <span>이미지 개수 : &nbsp;
                                    <span className={extraValue.images.length < 10 ? 'text-yellow-700' : extraValue.images.length < 20 ? 'text-blue-700' : 'text-red-600'}>
                                      {extraValue.images.length}
                                    </span>
                                    &nbsp; / {MAX_IMAGE}
                                  </span>
                                </div>
                            </div>
                        }
                    </button>
                    <input type={'file'}
                           accept={['image/jpeg','image/bmp','image/png'].join(', ')}
                           multiple={true}
                           onChange={onChangeHandler}
                           ref={inputRef}
                           hidden={true}
                           disabled={waitUpload || extraValue.images.length >= MAX_IMAGE}
                           max={10}
                    />
                </div>
            }
            {
                extraValue?.images?.length > 0
                && <div className={'flex justify-end'}>
                    { modeComponent }
                </div>
            }
            {
                extraValue?.images?.length > 0
                && modeView
            }
            {
                extraValue?.images?.length > 0
                && albumToggle?.viewToggle
                && <ImageView images={extraValue.images} />
            }
        </div>
        </AlbumProvider.Provider>
    )
}

export default AlbumBlock;