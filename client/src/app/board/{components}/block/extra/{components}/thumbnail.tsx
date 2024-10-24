import React, {CSSProperties, useContext, useMemo, useRef, useState} from "react";
import AlbumProvider from "@/app/board/{components}/block/extra/providers/albumProvier";
import DeleteOverlay from "@/app/board/{components}/block/extra/{components}/deleteOverlay";
import DefaultLabel from "@/app/board/{components}/block/extra/{components}/defaultLabel";
import Image from "next/image";
import {useDefaultImage} from "@/app/{hooks}/useDefaultImage";

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
    deleteImageHandler: (filename: string, index: number) => void;
    onChaneDefaultIndexHandler: (index: number) => void;
}) => {
    const [columns, setColumns] = useState<number>(5);
    const [columnToggle, setColumnToggle] = useState<boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);

    const { setAlbumToggle } = useContext(AlbumProvider);
    const { defaultNoImg } = useDefaultImage();

    const arrays = useMemo(() =>
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
    ,[]);

    const imageList = useMemo(() =>
        images?.map((image, index) => {
            return (
                <div key={'thumbnail' + index}
                     className={'relative flex'}>
                    <Image className={'w-full flex justify-center object-cover items-center border-2 border-solid border-[#BFDBFE] aspect-square transform-gpu'}
                           src={defaultNoImg(image.replace(/(\.[^.]+)$/, '_thumb$1'))}
                           width={200}
                           height={200}
                           priority={true}
                           alt={'thumbnail'}
                           placeholder={'empty'}
                           onError={(e) => {
                               e.currentTarget.src = defaultNoImg('');
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
                        !isView
                        && <DeleteOverlay {...{index, image, deleteImageHandler, setAlbumToggle, onChaneDefaultIndexHandler}} />
                    }
                    {
                        index === defaultIndex
                        && <DefaultLabel />
                    }
                </div>
            )
        })
    ,[images, isView, defaultIndex])

    return (
        <div className={'w-full flex flex-col relative'}
             ref={divRef}
        >
            <div className={'w-full flex justify-end'}>
                <div className={'relative flex flex-col py-2 text-sm'}>
                    <button className={'w-24 h-10 bg-white rounded border border-solid border-gray-200'}
                            onClick={() => setColumnToggle(!columnToggle)}
                    >크기 : {columns}개</button>
                    <div className={['absolute flex flex-col top-10 left-0 z-30 w-24  overflow-y-hidden duration-500',
                        columnToggle ? 'max-h-52 rounded-b-sm shadow-md' : 'max-h-0'
                    ].join(' ')}>
                        { arrays }
                    </div>
                </div>
            </div>
            <div style={imagesContainerStyle(columns)}
                 className={'w-full border-2 border-solid border-[#BFDBFE] transform-gpu'}
            >
                {
                    images?.length > 0
                    && imageList
                }
            </div>
        </div>
    )
}

const imagesContainerStyle = (columns:number) : CSSProperties => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
});

export default Thumbnail;