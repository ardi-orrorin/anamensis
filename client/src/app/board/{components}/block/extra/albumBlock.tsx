import {ExpendBlockProps, FileContentType} from "@/app/board/{components}/block/type/Types";
import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import TempFileProvider from "@/app/board/{services}/TempFileProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBorderAll, faImage} from "@fortawesome/free-solid-svg-icons";
import AlbumProvider, {AlbumToggleType} from "@/app/board/{components}/block/extra/providers/albumProvier";
import apiCall from "@/app/{commons}/func/api";
import {FileContentI} from "@/app/api/file/img/route";
import ImageView from "@/app/board/{components}/block/extra/{components}/ImageView";
import Thumbnail from "@/app/board/{components}/block/extra/{components}/thumbnail";
import Slide from "@/app/board/{components}/block/extra/{components}/slide";
import {deleteImage} from "@/app/board/{services}/funcs";
import BoardProvider from "@/app/board/{services}/BoardProvider";

export type ImageShowProps = {
    defaultIndex: number;
    images: string[];
    mode: 'slide' | 'fade' | 'card' | 'thumbnail';
}

export type ProgressType = {
    size: number;
    progress: number;
}

const AlbumBlock = (props: ExpendBlockProps) => {
    const {
        hash, value
        , onChangeExtraValueHandler
        , isView
        , type
    }: ExpendBlockProps = props;

    const maxImage = 30;
    const oneFileLength = 5;
    const maxFileSize = 5 * 1024 * 1024;

    const extraValue = props.extraValue as ImageShowProps;
    const {
        waitUploadFiles, setWaitUploadFiles,
        waitRemoveFiles, setWaitRemoveFiles
    } = useContext(TempFileProvider);

    const {board} = useContext(BoardProvider);
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

    const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;
        if(files.length > oneFileLength) {
            alert(`한번에 최대 ${oneFileLength}개까지 업로드 가능합니다.`);
            e.currentTarget.value = '';
            return;
        }
        if(files.length + extraValue.images.length > maxImage) {
            alert(`이미지는 최대 ${maxImage}개까지 가능합니다.`);
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
            file.size > maxFileSize || size++;
        }

        setUploadProgress({
            size,
            progress: 0,
        });

        for(const file of files) {
            upload(file, fileContent, uploadedImages, size, progress);
        }

        e.target.value = '';
    },[extraValue, isView, title, membersOnly, isPublic]);

    const upload = useCallback(async (file: File, fileContent: FileContentType, uploadedImages: string[], size: number, progress: number[]) => {

        if(file.size > maxFileSize) return;

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
    },[extraValue, isView, title, membersOnly, isPublic]);


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

    const deleteImageHandler = useCallback(async (absolutePath: string, index: number) => {
        try {
            const res = await apiCall({
                path: '/api/file/delete/filename',
                method: 'PUT',
                body: {fileUri: absolutePath},
                contentType: 'application/json',
            });

            if(!res) return;

            if(!onChangeExtraValueHandler) return;

            const fileName = absolutePath.substring(absolutePath.lastIndexOf('/') + 1);
            const filePath = absolutePath.substring(0, absolutePath.lastIndexOf('/') + 1);

            onChangeExtraValueHandler({
                ...extraValue,
                images: extraValue.images.filter(image => image !== absolutePath),
                defaultIndex: extraValue.defaultIndex === index ? 0 : extraValue.defaultIndex,
            } as ImageShowProps);

            deleteImage({
                absolutePath,
                setWaitUploadFiles,
                setWaitRemoveFiles,
            });

            setWaitUploadFiles(prevState => {
                return prevState.filter(item => item.fileName !== fileName);
            });

            setWaitRemoveFiles(prevState => {
                return [...prevState, {id: 0, fileName, filePath}];
            });

        } catch (e) {
            console.error(e);
        }
    },[extraValue, waitUploadFiles, waitRemoveFiles, isView]);

    const componentProps = useMemo(() => ({
        images       : extraValue?.images || [],
        isView       : isView || false,
        defaultIndex : extraValue?.defaultIndex ?? 0,
        deleteImageHandler,
        onChaneDefaultIndexHandler,
    }),[isView, extraValue]);

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
                && extraValue?.images?.length < maxImage
                && <div className={'w-full flex justify-center'}>
                    <button className={'w-full flex flex-col justify-center items-center gap-3 py-4 px-2 bg-white rounded border border-solid border-gray-200'}
                            onClick={() => inputRef.current?.click()}
                    >
                        <p>
                            {
                                uploadProgress?.size === uploadProgress?.progress
                                ? '이미지 업로드 완료'
                                : '이미지 업로드 진행중 (최대 30개)'
                            }
                        </p>
                        {
                            uploadProgress.size > 0
                            && extraValue?.images?.length > 0
                            && extraValue?.images?.length < maxImage
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
                                    &nbsp; / {maxImage}
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
                           disabled={extraValue.images.length >= maxImage}
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