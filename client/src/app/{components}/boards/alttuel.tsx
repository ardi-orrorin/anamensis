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
            <div className={'min-w-[90px] max-w-[90px] sm:min-w-[120px] sm:max-w-[120px] h-full'}>
                <Image className={'w-full h-full object-cover'}
                       src={defaultNoImg(extraValue?.img?.replace(/(\.[^.]+)$/, '_thumb$1'))}
                       width={80}
                       height={80}
                       alt={''}
                       onError={e => {
                           (e.target as HTMLImageElement).src = process.env.NEXT_PUBLIC_CDN_SERVER + '/noimage.jpg'
                       }}
                />

            </div>
            <div className={'w-full h-full flex flex-col justify-between'}>
                <HeaderComponent {...props} />
                <div className={'flex flex-col px-3 py-1 gap-1 w-full justify-between overflow-y-auto'}>
                    <div className={'flex flex-col gap-1 justify-between'}>
                        <p className={'text-sm'}>
                            상품명 : &nbsp; {value}
                        </p>
                        <div className={'flex gap-5'}>
                            <p className={'text-xs text-red-600 font-bold'}>
                                가격: &nbsp; {money(extraValue?.price)}
                            </p>
                            <p className={'text-xs text-gray-600'}>
                                배송비: &nbsp; {money(extraValue?.deliveryFee)}
                            </p>
                        </div>
                    </div>
                    <div className={'flex flex-wrap gap-2'}>
                        {
                            extraValue?.tags
                            && extraValue?.tags?.length > 0
                                ? extraValue?.tags?.map((tag, index) =>
                                    <label key={index} className={'text-gray-500 text-xs'}>
                                        {tag}
                                    </label>
                                )
                                : <label className={'text-gray-500 text-xs'}>
                                    No Tag
                                </label>
                        }
                    </div>
                </div>
                <FooterComponent {...props} />
            </div>
        </div>
    )
}

export default AlttuelBoardComponent;