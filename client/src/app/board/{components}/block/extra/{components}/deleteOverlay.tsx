import React, {Dispatch, SetStateAction} from "react";
import {AlbumToggleType} from "@/app/board/{components}/block/extra/providers/albumProvier";

const DeleteOverlay = ({
    index,
    image,
    deleteImageHandler,
    setAlbumToggle,
    onChaneDefaultIndexHandler
} : {
    index: number;
    image: string;
    deleteImageHandler: (filename: string, index: number) => void;
    setAlbumToggle: Dispatch<SetStateAction<AlbumToggleType>>;
    onChaneDefaultIndexHandler: (index: number) => void;
}) => {

    return (
        <div className={'absolute hidden w-full h-full bg-gray-300 opacity-60'}
             onMouseLeave={(e) => {
                 e?.currentTarget?.classList.replace('flex', 'hidden');}
             }
        >
            <button className={'z-50 justify-center items-center border text-white bg-white border-solid w-1/2 h-full hover:bg-gray-700 duration-500'}
                    onClick={(e) => {
                        setAlbumToggle({
                            viewImage: image,
                            viewToggle: true,
                        });
                    }}
            >
                보기
            </button>
            <button className={'z-50 justify-center items-center border text-white bg-white border-solid w-1/2 h-full hover:bg-gray-700 duration-500'}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onChaneDefaultIndexHandler(index);
                    }}
            >
                대표
            </button>
            <button className={'z-50 justify-center items-center border text-white bg-white border-solid w-1/2 h-full hover:bg-gray-700 duration-500'}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteImageHandler(image, index);
                    }}
            >
                삭제
            </button>
        </div>
    )
}

export default DeleteOverlay;