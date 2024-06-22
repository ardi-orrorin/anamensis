import {BlockProps} from "@/app/board/{components}/block/type/Types";
import React, {CSSProperties, useContext, useEffect, useRef, useState} from "react";
import TempFileProvider from "@/app/board/{services}/TempFileProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faBorderAll, faChevronLeft, faChevronRight, faImage} from "@fortawesome/free-solid-svg-icons";
import AlbumProvider, {AlbumToggleType} from "@/app/board/{components}/block/extra/providers/albumProvier";

export type ImageShowProps = {
    defaultIndex: number;
    images: string[];
    mode: 'slide' | 'fade' | 'card' | 'thumbnail';
}

const AlbumBlock = (props: BlockProps) => {
    const {
        hash, value
        , onChangeExtraValueHandler
        , isView
    }: BlockProps = props;

    const extraValue = props.extraValue as ImageShowProps;
    const {setWaitUploadFiles, setWaitRemoveFiles} = useContext(TempFileProvider);

    const [albumToggle, setAlbumToggle] = useState<AlbumToggleType>({
        viewImage: '',
        viewToggle: false,
    } as AlbumToggleType);


    const imgs = [
        'f1.jpg', 'f2.jpg', 'f3.jpg', 'f4.jpg', 'f5.jpg', 'f6.jpg', 'f7.jpg', 'f8.jpg', 'f9.jpg', 'f10.jpg'
        , 'f11.jpg', 'f12.jpg', 'f13.jpg', 'f14.jpg']


    useEffect(() => {
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            defaultIndex: 0,
            images: [...imgs],
            mode: 'thumbnail',
        } as ImageShowProps);

    },[]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;
        if(files.length > 10) {
            alert('최대 10개까지 업로드 가능합니다.');
            e.currentTarget.value = '';
            return;
        }

        if(files.length === 0) return;

        for(const file of files) {
            const maxSize = 5 * 1024 * 1024;

            if(file.size > maxSize) continue;

            // api call
        }
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
    }

    const modes = [
        {icon: faBorderAll, mode: 'thumbnail', component: <Thumbnail images={extraValue.images} />},
        {icon: faImage, mode: 'slide', component: <Thumbnail images={extraValue.images} />},
    ]

    return (
        <div style={containerStyle}>
        <AlbumProvider.Provider value={{albumToggle, setAlbumToggle}}>
            <div>
                <input type={'file'}
                       accept={'image/*'}
                       multiple={true}
                       onChange={onChangeHandler}
                />
            </div>
            <div className={'flex justify-end'}>
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
            {
                modes.find(mode =>
                    mode.mode === extraValue.mode
                )?.component
            }
        </AlbumProvider.Provider>
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

    const prefix = 'https://anamensis.s3.ap-northeast-2.amazonaws.com/resource/test/'

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
                                   src={prefix + image}
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
            {
                albumToggle?.viewToggle
                && <ImageView images={images} />
            }
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

    const prefix = 'https://anamensis.s3.ap-northeast-2.amazonaws.com/resource/test/'

    return (
        <>
            <div className={'z-30 flex justify-center items-center fixed top-0 left-0 w-full h-full'}
                onClick={disableToggleHandler}
            >
                <button className={'z-50 absolute top-5 right-5 w-10 h-10 bg-white rounded-full'}
                        onClick={disableToggleHandler}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
                <img src={prefix + albumToggle.viewImage}
                     className={'w-auto max-w-[90%] h-auto max-h-[90%] bg-white'}
                     alt={'view'}
                     onClick={disableToggleHandler}
                />
                <button className={'z-40 fixed top-0 left-0 w-[20%] h-full flex items-center pl-10'}
                        onClick={prevImage}
                >
                  <button className={'z-50 w-16 h-16 bg-white rounded-full'}
                          onClick={prevImage}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                </button>
                <button className={'z-40 fixed top-0 right-0 w-[20%] h-full flex justify-end items-center pr-10'}
                        onClick={nextImage}
                >
                  <button className={'z-50 w-16 h-16 bg-white rounded-full'}
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