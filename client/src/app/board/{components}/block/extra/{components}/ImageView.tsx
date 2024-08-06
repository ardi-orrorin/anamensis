import React, {useCallback, useContext} from "react";
import AlbumProvider from "@/app/board/{components}/block/extra/providers/albumProvier";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {defaultNoImg} from "@/app/{commons}/func/image";
import {NO_IMAGE} from "@/app/{services}/constants";
import Image from "next/image";

const ImageView = ({
    images,
} : {
    images: string[];
}) => {
    const {albumToggle, setAlbumToggle} = useContext(AlbumProvider);

    const prevImage = useCallback((e: React.MouseEvent) => {
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
    },[albumToggle]);

    const nextImage = useCallback((e: React.MouseEvent) => {
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
    },[albumToggle]);

    const disableToggleHandler = useCallback(() => {
        setAlbumToggle({
            viewImage: '',
            viewToggle: false,
        });
    },[]);

    return (
        <>
            <div className={'z-30 flex justify-center items-center fixed top-0 left-0 w-full h-full'}>
                <button className={'z-50 absolute top-5 right-5 w-[40px] h-[40px] bg-white rounded-full shadow-md'}
                        onClick={disableToggleHandler}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <Image src={defaultNoImg(albumToggle.viewImage)}
                       className={'w-auto max-w-[90%] h-auto max-h-[90%] bg-white shadow-md drop-shadow-md rounded-md'}
                       width={1200}
                       height={1200}
                       priority={true}
                       alt={'view'}
                       onError={(e) => {
                           e.currentTarget.src = NO_IMAGE;
                       }}
                />
                <div className={'z-40 fixed top-0 left-0 w-full h-full flex justify-between'}>
                    <button className={'min-w-[25%] w-[25%] h-full flex justify-center items-center shadow-md'}
                            onClick={prevImage}
                    >
                        <span className={'w-[50px] h-[50px] flex justify-center items-center  bg-white rounded-full'}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </span>
                    </button>
                    <button className={'w-[50%] h-full flex justify-center items-center'}
                            onClick={disableToggleHandler}
                    >
                    </button>
                    <button className={'min-w-[25%] w-[25%] h-full flex justify-center items-center'}
                            onClick={nextImage}
                    >
                        <span className={'z-50 w-[50px] h-[50px] flex justify-center items-center bg-white rounded-full shadow-md'}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </span>
                    </button>
                </div>
            </div>
            <div className={'z-10 fixed left-0 top-0 w-full h-full bg-gray-800 opacity-70'} />
        </>
    )
}

export default ImageView;
