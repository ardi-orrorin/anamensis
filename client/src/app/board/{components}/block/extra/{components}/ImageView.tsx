import React, {useContext} from "react";
import AlbumProvider from "@/app/board/{components}/block/extra/providers/albumProvier";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {defaultNoImg} from "@/app/{commons}/func/image";
import {NO_IMAGE} from "@/app/{services}/constants";

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
                 // onClick={disableToggleHandler}
            >
                <button className={'z-50 absolute top-5 right-5 w-[40px] h-[40px] bg-white rounded-full'}
                        onClick={disableToggleHandler}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <img src={defaultNoImg(albumToggle.viewImage)}
                     className={'w-auto max-w-[90%] h-auto max-h-[90%] bg-white'}
                     alt={'view'}
                     onClick={disableToggleHandler}
                     onError={(e) => {
                         e.currentTarget.src = NO_IMAGE;
                     }}
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

export default ImageView;