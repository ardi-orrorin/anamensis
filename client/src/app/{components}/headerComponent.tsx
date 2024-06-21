import {Category} from "@/app/board/{services}/types";
import Image from "next/image";
import {defaultProfile} from "@/app/{commons}/func/image";
import React from "react";
import {BoardListI} from "@/app/{components}/boardComponent";

const HeaderComponent = (props: BoardListI) => {
    const {
        title, categoryPk
        , isPublic, profileImage
        , writer
    } = props;
    return (
        <div className={'flex h-[55px] min-h[55px] max-h-[55px] border-b border-solid border-gray-200 justify-between px-3 items-center'}>
            <div className={'h-auto flex flex-col gap-1'}>
                <span className={'flex gap-2 text-xs text-blue-700'}>
                    <span>
                        {Category.findById(categoryPk)?.name}
                    </span>
                    <span className={'text-red-600'}>
                        {isPublic ? '' : '비공개'}
                    </span>
                </span>
                <span className={'text-sm'}>
                    {title}
                </span>
            </div>
            <div className={'flex flex-col gap-1 items-center'}>
                <div className={'flex items-center gap-1'}>
                    <Image className={'rounded-full'}
                           src={defaultProfile(profileImage)}
                           width={25}
                           height={25}
                           alt={''}
                    />
                    <span className={'text-sm'}>
                        {writer}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default HeaderComponent;