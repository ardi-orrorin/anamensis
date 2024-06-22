import {AlttuelBlockProps} from "@/app/board/{components}/block/extra/alttuelBlock";
import HeaderComponent from "@/app/{components}/headerComponent";
import Image from "next/image";
import {defaultNoImg} from "@/app/{commons}/func/image";
import FooterComponent from "@/app/{components}/footerComponent";
import React from "react";
import {BoardListI} from "@/app/{components}/boardComponent";

const AlttuelBoardComponent = (props: BoardListI) => {
    const { body} = props;

    const alttuelBlock = body?.filter((block) =>
        block.code === '00301'
    )[0];

    const extraValue = alttuelBlock?.extraValue as AlttuelBlockProps;

    const value = alttuelBlock?.value;

    const money = (value: number) => {
        if(!value || value === 0) return '무료';

        const money = value
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        return money + '원';
    }

    return (
        <>
            <HeaderComponent {...props} />
            <div className={'p-3 flex gap-3 h-auto'}>
                <Image className={'rounded'}
                       src={defaultNoImg(extraValue?.img?.replace(/(\.[^.]+)$/, '_thumb$1'))}
                       width={80}
                       height={80}
                       alt={''}
                />
                <div className={'flex flex-col w-full justify-between gap-1'}>
                    <div className={'flex gap-1'}>
                        {
                            extraValue?.tags
                            && extraValue?.tags?.length > 0
                                ? extraValue?.tags?.map((tag, index) =>
                                    <label key={index} className={'bg-gray-600 px-2 py-0.5 text-xs text-white'}>
                                        {tag}
                                    </label>
                                )
                                : <label className={'bg-gray-400 px-2 py-0.5 text-xs text-white'}>
                                    No Tag
                                </label>
                        }
                    </div>
                    <div className={'flex flex-col gap-0.5'}>
                        <p className={'text-sm'}>
                            상품명 : &nbsp; {value}
                        </p>
                        <p className={'text-xs text-red-600 font-bold'}>
                            가격: &nbsp; {money(extraValue?.price)}
                        </p>
                        <p className={'text-xs text-gray-600'}>
                            배송비: &nbsp; {money(extraValue?.deliveryFee)}
                        </p>
                    </div>
                </div>
            </div>
            <FooterComponent {...props} />
        </>
    )
}

export default AlttuelBoardComponent;