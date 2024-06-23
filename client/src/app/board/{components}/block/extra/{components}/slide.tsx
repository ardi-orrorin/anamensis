import React, {useContext, useMemo, useRef, useState} from "react";
import AlbumProvider from "@/app/board/{components}/block/extra/providers/albumProvier";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {defaultNoImg} from "@/app/{commons}/func/image";
import DeleteOverlay from "@/app/board/{components}/block/extra/{components}/deleteOverlay";
import DefaultLabel from "@/app/board/{components}/block/extra/{components}/defaultLabel";

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
    deleteImageHandler: (filename: string) => void;
    onChaneDefaultIndexHandler: (index: number) => void;
}) => {

    const [mouseDownX, setMouseDownX] = useState<number>(0);

    const {setAlbumToggle } = useContext(AlbumProvider);
    const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);

    const containerRef = useRef<HTMLDivElement>(null);

    const [containerPosition, setContainerPosition] = useState<number>(0);

    const slideWidth = 150;
    const totalWidth = images.length * slideWidth ;

    const containerMaxWidth = useMemo(()=> {
        if(!containerRef?.current) return 0;
        const containerWidth = containerRef.current.clientWidth - (containerRef.current.clientWidth % slideWidth);
        return totalWidth - containerWidth
    },[containerRef?.current]);

    const prevSlide = () => {
        const result =
            containerPosition + slideWidth <= 0
                ? containerPosition + slideWidth
                : -containerMaxWidth;

        setContainerPosition(result);
    }

    const nextSlide = () => {
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
                     onError={(e) => {
                         (e.target as HTMLImageElement).src = process.env.NEXT_PUBLIC_CDN_SERVER + '/noimage.jpg'
                     }}
                />
                <button className={'absolute right-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200'}
                        onClick={nextImage}
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
                               onClick={prevSlide}
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
                        && images?.map((image, index) => {
                            return (
                                <div key={'slide' + index}
                                     className={'relative flex duration-500'}
                                     style={{width: slideWidth}}
                                >
                                    <img className={[
                                             `min-w-[${slideWidth}px] w-[${slideWidth}px] max-w-[${slideWidth}px] min-h-[${slideWidth}px] h-[${slideWidth}px] max-h-[${slideWidth}px] object-cover border-solid`,
                                             index === selectedIndex ? 'border-4 border-blue-400' : 'border border-white'
                                         ].join(' ')}
                                         src={defaultNoImg(image.replace(/(\.[^.]+)$/, '_thumb$1'))}
                                         alt={'slide'}
                                         onError={(e) => {
                                             (e.target as HTMLImageElement).src = process.env.NEXT_PUBLIC_CDN_SERVER + '/noimage.jpg'
                                         }}
                                         onClick={() => {
                                             setSelectedIndex(index);
                                         }}
                                         onMouseEnter={(e) => {
                                             if(isView) {
                                                 mouseDownX === 0 && setSelectedIndex(index);
                                             } else {
                                                 e?.currentTarget?.parentElement?.children[1]
                                                     .classList.replace('hidden', 'flex');
                                             }
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

                {
                    containerRef?.current
                    && containerRef?.current?.clientWidth < totalWidth
                    && <button className={'absolute right-5 z-10 w-10 h-10 bg-white rounded border border-solid border-gray-200 opacity-70'}
                               onClick={nextSlide}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                }

            </div>
        </div>
    )
}

export default Slide;