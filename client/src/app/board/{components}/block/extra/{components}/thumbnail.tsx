import React, {CSSProperties, useContext, useEffect, useRef, useState} from "react";
import AlbumProvider from "@/app/board/{components}/block/extra/providers/albumProvier";
import {defaultNoImg} from "@/app/{commons}/func/image";
import DeleteOverlay from "@/app/board/{components}/block/extra/{components}/deleteOverlay";
import DefaultLabel from "@/app/board/{components}/block/extra/{components}/defaultLabel";

const Thumbnail = ({
    images,
    isView,
    deleteImageHandler,
    onChaneDefaultIndexHandler,
    defaultIndex,
} : {
    images: string[];
    isView: boolean;
    defaultIndex: number;
    deleteImageHandler: (filename: string) => void;
    onChaneDefaultIndexHandler: (index: number) => void;
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
            <div style={imagesContainerStyle(columns)}
                 className={'transform-gpu'}
            >
                {
                    images?.length > 0
                    && images?.map((image, index) => {
                        return (
                            <div key={'thumbnail' + index}
                                 className={'relative flex'}>
                                <img style={imageStyle(divWidth / columns)}

                                     className={'transform-gpu'}
                                     src={defaultNoImg(image.replace(/(\.[^.]+)$/, '_thumb$1'))}
                                     alt={'thumbnail'}
                                     onError={(e) => {
                                         (e.target as HTMLImageElement).src = process.env.NEXT_PUBLIC_CDN_SERVER + '/noimage.jpg'
                                     }}
                                     onClick={() => {
                                         setAlbumToggle({
                                             viewImage: image,
                                             viewToggle: true,
                                         });
                                     }}
                                     onMouseEnter={(e) => {
                                         if(isView) return;
                                         e?.currentTarget?.parentElement?.children[1]
                                             .classList.replace('hidden', 'flex');
                                     }}
                                />
                                {
                                    !isView && <DeleteOverlay {...{index, image, deleteImageHandler, setAlbumToggle, onChaneDefaultIndexHandler}} />
                                }
                                {
                                    index === defaultIndex && <DefaultLabel />
                                }
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}


const containerStyle: CSSProperties = {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    position: 'relative',
}

const imagesContainerStyle = (columns:number) : CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    border: '2px solid #BFDBFE',
    width: '100%',
});

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

export default Thumbnail;