import {Category} from "@/app/board/{services}/types";
import Image from "next/image";
import {defaultProfile} from "@/app/{commons}/func/image";
import React from "react";
import {BoardListI} from "@/app/{components}/boardComponent";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const HeaderComponent = (props: BoardListI) => {
    const {
        title, categoryPk
        , isPublic, profileImage
        , writer, membersOnly
    } = props;
    return (
        <div className={'pt-2 flex w-full h-[55px] min-h[55px] max-h-[55px] justify-between px-3 items-center'}>
            <div className={'h-auto flex flex-col gap-1'}>
                <span className={'flex gap-2 text-xs text-blue-700'}>
                    <span className={''}>
                        {Category.findById(categoryPk)?.name}
                    </span>
                    {
                        membersOnly
                        && <span className={'font-bold text-yellow-600'}>
                           회원
                        </span>
                    }
                    {
                        !isPublic
                        && <span className={'font-bold text-red-600'}>
                           비공개
                        </span>
                    }
                </span>
                <span className={'text-sm line-clamp-1'}>
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