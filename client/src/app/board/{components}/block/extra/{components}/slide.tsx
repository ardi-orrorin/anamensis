import React, {useCallback, useContext, useMemo, useRef, useState} from "react";
import AlbumProvider from "@/app/board/{components}/block/extra/providers/albumProvier";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {defaultNoImg} from "@/app/{commons}/func/image";
import DeleteOverlay from "@/app/board/{components}/block/extra/{components}/deleteOverlay";
import DefaultLabel from "@/app/board/{components}/block/extra/{components}/defaultLabel";
import {NO_IMAGE} from "@/app/{services}/constants";
import Image from "next/image";

const Slide = ({
    images,
    isView,
    defaultIndex,
    deleteImageHandler,
    onChaneDefaultIndexHandler,
} : {
    images: string[];
    isView: boolean;
    defaultIndex: number;
    deleteImageHandler: (filename: string, index: number) => void;
    onChaneDefaultIndexHandler: (index: number) => void;
}) => {

    const slideWidth = 150;
    const totalWidth = images.length * slideWidth ;

    const [mouseDownX, setMouseDownX] = useState<number>(0);

    const {setAlbumToggle } = useContext(AlbumProvider);
    const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);

    const containerRef = useRef<HTMLDivElement>(null);

    const [containerPosition, setContainerPosition] = useState<number>(0);

    const containerMaxWidth = useMemo(()=> {
        if(!containerRef?.current) return 0;
        const containerWidth = containerRef.current.clientWidth - (containerRef.current.clientWidth % slideWidth);
        return totalWidth - containerWidth
    },[containerRef?.current?.clientWidth]);

    const slide = useCallback((isReverse: boolean) => {
        const imageLength = Math.floor(Number(containerRef?.current?.offsetWidth) / slideWidth);
        const result = isReverse
            ? containerPosition + slideWidth <= 0
                ? containerPosition + slideWidth * imageLength
                : -containerMaxWidth
            : containerPosition <= -containerMaxWidth
                ? 0
                : containerPosition - slideWidth * imageLength;

        setContainerPosition(result);
    },[containerRef?.current, slideWidth, containerPosition]);

    const imageShow = useCallback((isReverse: boolean) => {
       isReverse
       ? selectedIndex === 0
            ? setSelectedIndex(images.length - 1)
            : setSelectedIndex(selectedIndex - 1)
       : selectedIndex === images.length - 1
            ? setSelectedIndex(0)
            : setSelectedIndex(selectedIndex + 1);
    },[selectedIndex]);

    const onMouseUpHandler = useCallback((e: React.MouseEvent) => {
        const cur = containerPosition - (mouseDownX - e.clientX) * 2;

        cur >= 0
        ? setContainerPosition(0)
        : cur <= -containerMaxWidth
            ? setContainerPosition(-containerMaxWidth)
            : setContainerPosition(cur);

        setMouseDownX(0);
    },[mouseDownX, containerPosition, containerMaxWidth]);

    const onImageClick = useCallback(() => {
        setAlbumToggle({
            viewImage: images[selectedIndex],
            viewToggle: true,
        });
    },[selectedIndex]);

    const imageList = useMemo(() =>
        images?.map((image, index) => {
            return (
                <div key={'slide' + index}
                     className={'relative flex duration-500'}
                     style={{width: slideWidth}}
                >
                    <Image className={[
                        `min-w-[${slideWidth}px] w-[${slideWidth}px] max-w-[${slideWidth}px] min-h-[${slideWidth}px] h-[${slideWidth}px] max-h-[${slideWidth}px] object-cover border-solid`,
                        index === selectedIndex ? 'border-4 border-blue-400' : 'border border-white'
                    ].join(' ')}
                           src={defaultNoImg(image.replace(/(\.[^.]+)$/, '_thumb$1'))}
                           alt={'slide'}
                           width={500}
                           height={500}
                              priority={true}
                            onError={(e) => {
                                e.currentTarget.src = NO_IMAGE;
                            }}
                            onClick={() => {
                                setSelectedIndex(index);
                            }}
                            onMouseEnter={(e) => {
                                e?.currentTarget?.parentElement?.children[1]
                                    ?.classList.replace('hidden', 'flex');
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
    ,[isView, selectedIndex, defaultIndex]);

    return (
        <div className={'flex flex-col gap-2 w-full px-4'}>
            <div className={'relative flex w-auto justify-center items-center'}>
                <button className={'absolute left-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200'}
                           onClick={()=>imageShow(true)}
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <Image className={'w-full h-[600px] sm:h-[800px] rounded-xl object-cover sm:object-contain'}
                       src={process.env.NEXT_PUBLIC_CDN_SERVER + images[selectedIndex]} alt={''}
                       width={200}
                       height={200}
                       priority={true}
                       onClick={onImageClick}
                       onError={(e) => {
                           e.currentTarget.src = NO_IMAGE;
                       }}
                />
                <button className={'absolute right-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200'}
                        onClick={()=>imageShow(false)}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
                {
                    selectedIndex === defaultIndex && <DefaultLabel />
                }
            </div>
            <div className={'relative flex items-center justify-between overflow-hidden duration-500 bg-white rounded-xl'}
                 ref={containerRef}
            >
                {
                    containerRef?.current
                    && containerRef?.current?.clientWidth < totalWidth
                    && <button className={'absolute left-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200 opacity-70'}
                               onClick={()=> slide(true)}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                }
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
                        && imageList
                    }
                </div>
                {
                    containerRef?.current
                    && containerRef?.current?.clientWidth < totalWidth
                    && <button className={'absolute right-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200 opacity-70'}
                               onClick={()=> slide(false)}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                }

            </div>
        </div>
    )
}

export default Slide;