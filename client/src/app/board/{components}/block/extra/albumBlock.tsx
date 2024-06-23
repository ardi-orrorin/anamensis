import {BlockProps, FileContentType} from "@/app/board/{components}/block/type/Types";
import React, {CSSProperties, useContext, useEffect, useRef, useState} from "react";
import TempFileProvider from "@/app/board/{services}/TempFileProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faBorderAll, faChevronLeft, faChevronRight, faImage} from "@fortawesome/free-solid-svg-icons";
import AlbumProvider, {AlbumToggleType} from "@/app/board/{components}/block/extra/providers/albumProvier";
import apiCall from "@/app/{commons}/func/api";
import {FileContentI} from "@/app/api/file/img/route";
import {defaultNoImg} from "@/app/{commons}/func/image";

export type ImageShowProps = {
    defaultIndex: number;
    images: string[];
    mode: 'slide' | 'fade' | 'card' | 'thumbnail';
}

export type ProgressType = {
    size: number;
    progress: number;
}

const AlbumBlock = (props: BlockProps) => {
    const {
        hash, value
        , onChangeExtraValueHandler
        , isView
    }: BlockProps = props;

    const maxImage = 30;
    const maxFileSize = 5 * 1024 * 1024;

    const extraValue = props.extraValue as ImageShowProps;
    const {setWaitUploadFiles, setWaitRemoveFiles} = useContext(TempFileProvider);
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

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;
        if(files.length > 10) {
            alert('한번에 최대 10개까지 업로드 가능합니다.');
            e.currentTarget.value = '';
            return;
        }
        if(files.length + extraValue.images.length > maxImage) {
            alert('이미지는 최대 30개까지 가능합니다.');
            return;
        }

        if(files.length === 0) return;

        const fileContent: FileContentType = {
            tableCodePk: 2,
            categoryPk: 4,
        }

        const uploadedImages: string[] = [];

        const progress: number[] = [];


        let size = 0;

        for(const file of files) {
            file.size > maxFileSize || size++;
        }


        for(const file of files) {
            upload(file, fileContent, uploadedImages, size, progress);

        }
    }

    const upload = async (file: File, fileContent: FileContentType, uploadedImages: string[], size: number, progress: number[]) => {

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
    }


    const onChangeModeHandler = (mode: string) => {
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            ...extraValue,
            mode: mode,
        } as ImageShowProps);
    }

    const containerStyle: CSSProperties = {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: '0.8rem',
    }

    const modes = [
        {icon: faBorderAll, mode: 'thumbnail', component: <Thumbnail {...extraValue} />},
        {icon: faImage, mode: 'slide', component: <Slide {...extraValue} />},
    ]

    return (
        <div id={`block_${hash}`}
             style={containerStyle}
             aria-roledescription={'object'}
        >
        <AlbumProvider.Provider value={{albumToggle, setAlbumToggle}}>
            {
                !isView
                && extraValue?.images?.length < maxImage
                && <div className={'w-full flex justify-center'}>
                    <button className={'w-full flex flex-col justify-center items-center gap-3 py-4 px-2 bg-white rounded border border-solid border-gray-200'}
                            onClick={() => inputRef.current?.click()}
                    >
                        <p>
                            {
                                extraValue?.images?.length >= maxImage
                                ? '이미지 업로드(최대 30개)'
                                : '이미지 업로드 완료'
                            }
                        </p>
                        {
                            uploadProgress.size > 0
                            && extraValue?.images?.length < maxImage
                            && <div className={'fled flex-col w-full gap-2'}>
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
                           accept={'image/*'}
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
                    {
                        modes.map((mode, index) => {
                            return (
                                <button key={'mode' + index}
                                        className={[
                                            'w-16 h-8 rounded border border-solid border-gray-200',
                                            extraValue.mode === mode.mode ? 'bg-gray-800' : 'bg-white'
                                        ].join(' ')}
                                        onClick={() => onChangeModeHandler(mode.mode)}
                                >
                                    <FontAwesomeIcon className={extraValue.mode === mode.mode ? 'text-white' : ''}
                                                     icon={mode.icon}
                                    />
                                </button>
                            )
                        })
                    }
                </div>
            }
            {
                extraValue?.images?.length > 0
                && modes.find(mode =>
                    mode.mode === extraValue.mode
                )?.component
            }
            {
                extraValue?.images?.length > 0
                && albumToggle?.viewToggle
                && <ImageView images={extraValue.images} />
            }
        </AlbumProvider.Provider>
        </div>
    )
}

const Slide = ({
    images,
    defaultIndex,
} : {
    defaultIndex: number;
    images: string[];
}) => {

    const [mouseDownX, setMouseDownX] = useState<number>(0);

    const { setAlbumToggle } = useContext(AlbumProvider);
    const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);

    const containerRef = useRef<HTMLDivElement>(null);

    const [containerPosition, setContainerPosition] = useState<number>(0);
    const slideWidth = 100;
    const totalWidth = images.length * slideWidth ;

    const prevSlide = () => {

        if(!containerRef?.current) return;

        const containerWidth = containerRef.current.clientWidth - (containerRef.current.clientWidth % slideWidth);
        const containerMaxWidth = totalWidth - containerWidth
        const result =
        containerPosition + slideWidth <= 0
        ? containerPosition + slideWidth
        : -containerMaxWidth;

        setContainerPosition(result);
    }

    const nextSlide = () => {

        if(!containerRef?.current) return;

        const containerWidth = containerRef.current.clientWidth - (containerRef.current.clientWidth % slideWidth);
        const containerMaxWidth = totalWidth - containerWidth;

        const result = containerPosition <= -containerMaxWidth
        ? 0
        : containerPosition - slideWidth;

        setContainerPosition(result);
    }

    const prevImage = () => {
        if(selectedIndex === 0) {
            setSelectedIndex(images.length - 1);
        } else {
            setSelectedIndex(selectedIndex - 1);
        }
    }

    const nextImage = () => {
        if(selectedIndex === images.length - 1) {
            setSelectedIndex(0);
        } else {
            setSelectedIndex(selectedIndex + 1);
        }
    }

    const onMouseUpHandler = (e: React.MouseEvent) => {

        if(!containerRef?.current) return;
        const containerWidth = containerRef.current.clientWidth - (containerRef.current.clientWidth % slideWidth);
        const containerMaxWidth = totalWidth - containerWidth;

        const cur = containerPosition - (mouseDownX - e.clientX) * 2;


        if(cur >= 0) {
            setContainerPosition(0);
        } else if(cur < -containerMaxWidth) {
            setContainerPosition(-containerMaxWidth);
        } else {
            setContainerPosition(cur);
        }

        setMouseDownX(0);

    }
    const onImageClick = () => {
        setAlbumToggle({
            viewImage: images[selectedIndex],
            viewToggle: true,
        });
    }


    return (
        <div className={'flex flex-col gap-2 w-full px-4'}>
            <div className={'relative flex w-auto justify-center items-center'}>
                <button className={'absolute left-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200'}
                        onClick={prevImage}
                >

                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <img className={'h-[400px] sm:h-[800px] rounded-xl object-contain'}
                     src={process.env.NEXT_PUBLIC_CDN_SERVER + images[selectedIndex]} alt={''}
                     onClick={onImageClick}
                />
                <button className={'absolute right-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200'}
                        onClick={nextImage}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
            <div className={'relative flex items-center justify-between overflow-hidden duration-500 bg-white rounded-xl'}
                 ref={containerRef}
            >
                <button className={'absolute left-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200'}
                        onClick={prevSlide}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <div className={'flex duration-500'}
                     style={{transform: `translateX(${containerPosition}px)`}}
                     onMouseDown={(e) => {
                         e.preventDefault();
                         setMouseDownX(e.clientX);
                     }}
                     onMouseUp={onMouseUpHandler}
                >
                    {
                        images?.length > 0
                        && images?.map((image, index) => {
                            return (
                                <img key={'slide' + index}
                                     className={[
                                         `w-[${slideWidth}px] max-w-[${slideWidth}px] h-[${slideWidth}px] max-h-[${slideWidth}px] object-cover  border-solid `,
                                            index === selectedIndex ? 'border-4 border-blue-400' : 'border border-white'
                                     ].join(' ')}
                                     src={defaultNoImg(image.replace(/(\.[^.]+)$/, '_thumb$1'))}
                                     alt={'slide'}
                                     onClick={() => {
                                        setSelectedIndex(index);
                                     }}
                                     onMouseEnter={() => {
                                         mouseDownX === 0 && setSelectedIndex(index);
                                     }}
                                />
                            )
                        })
                    }
                </div>
                <button className={'absolute right-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200'}
                        onClick={nextSlide}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    )
}

const Thumbnail = ({
    images,
} : {
    images: string[];
}) => {
    const [columns, setColumns] = useState<number>(5);
    const [columnToggle, setColumnToggle] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const [divWidth, setDivWidth] = useState<number>(500);

    const { albumToggle, setAlbumToggle } = useContext(AlbumProvider);

    useEffect(()=> {
        const test = setTimeout(() => {
            setDivWidth(Number(divRef?.current?.clientWidth));
        },900);

        return () => {
            clearTimeout(test);
        }
    })


    const containerStyle: CSSProperties = {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        position: 'relative',
    }

    const imagesContainerStyle: CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        border: '2px solid #BFDBFE',
        width: '100%',
    }

    const imageStyle = (height: number) : CSSProperties => ({
        border: '2px solid #BFDBFE',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        objectFit: 'cover',
        height: `${height}px`,
    });

    const selectStyle: CSSProperties = {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
    }

    return (
        <div style={containerStyle}
             ref={divRef}
        >
            <div style={selectStyle}>
                <div className={'relative flex flex-col py-2 text-sm'}>
                    <button className={'w-24 h-10 bg-white rounded border border-solid border-gray-200'}
                            onClick={() => setColumnToggle(!columnToggle)}
                    >크기 : {columns}개</button>
                    <div className={['absolute flex flex-col top-10 left-0 z-30 w-24  overflow-y-hidden duration-500',
                        columnToggle ? 'max-h-52 rounded-b-sm shadow-md' : 'max-h-0'
                    ].join(' ')}>
                        {
                            Array.from({length: 4}, (_, index) => {
                                return (
                                    <button key={'column' + index}
                                            className={'w-full bg-white border-y border border-solid border-gray-200 h-10'}
                                            onClick={() => {
                                                setColumns(index + 2);
                                                setColumnToggle(false);
                                            }}
                                    >
                                        {index + 2}
                                    </button>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div style={imagesContainerStyle}
                 className={'transform-gpu'}
            >
                {
                    images?.length > 0
                    && images?.map((image, index) => {
                        return (
                            <img style={imageStyle(divWidth / columns)}
                                   key={'thumbnail' + index}
                                   className={'transform-gpu'}
                                   src={defaultNoImg(image.replace(/(\.[^.]+)$/, '_thumb$1'))}
                                   alt={'thumbnail'}
                                   onClick={() => {
                                       setAlbumToggle({
                                          viewImage: image,
                                          viewToggle: true,
                                       });
                                   }}
                            />
                        )
                    })
                }
            </div>

        </div>
    )
}

const ImageView = ({
    images,
} : {
    images: string[];
}) => {

    const {albumToggle, setAlbumToggle} = useContext(AlbumProvider);

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        const index = images.indexOf(albumToggle.viewImage);
        if(index === 0) {
            setAlbumToggle({
                viewImage: images[images.length - 1],
                viewToggle: true,
            });
        } else {
            setAlbumToggle({
                viewImage: images[index - 1],
                viewToggle: true,
            });
        }
    }

    const nextImage = (e: React.MouseEvent) => {

        e.stopPropagation();
        e.preventDefault();

        const index = images.indexOf(albumToggle.viewImage);
        if(index === images.length - 1) {
            setAlbumToggle({
                viewImage: images[0],
                viewToggle: true,
            });
        } else {
            setAlbumToggle({
                viewImage: images[index + 1],
                viewToggle: true,
            });
        }
    }

    const disableToggleHandler = () => {
        setAlbumToggle({
            viewImage: '',
            viewToggle: false,
        });
    }

    return (
        <>
            <div className={'z-30 flex justify-center items-center fixed top-0 left-0 w-full h-full'}
                onClick={disableToggleHandler}
            >
                <button className={'z-50 absolute top-5 right-5 w-[40px] h-[40px] bg-white rounded-full'}
                        onClick={disableToggleHandler}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <img src={process.env.NEXT_PUBLIC_CDN_SERVER + albumToggle.viewImage}
                     className={'w-auto max-w-[90%] h-auto max-h-[90%] bg-white'}
                     alt={'view'}
                     onClick={disableToggleHandler}
                />
                <button className={'z-40 fixed top-0 left-0 w-[20%] h-full flex items-center pl-10'}
                        onClick={prevImage}
                >
                  <button className={'z-50 w-[40px] h-[40px] bg-white rounded-full'}
                          onClick={prevImage}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                </button>
                <button className={'z-40 fixed top-0 right-0 w-[20%] h-full flex justify-end items-center pr-10'}
                        onClick={nextImage}
                >
                  <button className={'z-50 w-[40px] h-[40px] bg-white rounded-full'}
                          onClick={nextImage}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </button>
            </div>
            <div className={'z-10 fixed left-0 top-0 w-full h-full bg-gray-800 opacity-40'} />
        </>
    )
}

export default AlbumBlock;