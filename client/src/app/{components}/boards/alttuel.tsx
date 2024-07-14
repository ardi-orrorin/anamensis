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
        <div className={'flex h-full'}>
            <div className={'relative min-w-[30%]'}>
                <Image className={'w-full h-full object-cover'}
                       src={defaultNoImg(extraValue?.img?.replace(/(\.[^.]+)$/, '_thumb$1'))}
                       width={80}
                       height={80}
                       alt={''}
                />
                <div className={'absolute z-10 left-2 bottom-2 flex flex-wrap gap-2'}>
                    {
                        extraValue?.tags
                        && extraValue?.tags?.length > 0
                            ? extraValue?.tags?.map((tag, index) =>
                                <label key={index} className={'bg-gray-500 px-2 py-1 text-xs text-white'}>
                                    {tag}
                                </label>
                            )
                            : <label className={'bg-gray-500 px-2 py-1 text-xs text-white'}>
                                No Tag
                            </label>
                    }
                </div>
            </div>
            <div className={'w-full h-full flex flex-col justify-between'}>
                <HeaderComponent {...props} />
                <div className={'flex flex-col gap-1 w-full justify-between'}>
                    <div className={'px-3 flex gap-5'}>
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
                <FooterComponent {...props} />
            </div>
        </div>
    )
}

export default AlttuelBoardComponent;