import {ImageShowProps} from "@/app/board/{components}/block/extra/albumBlock";
import HeaderComponent from "@/app/{components}/middleArea/headerComponent";
import FooterComponent from "@/app/{components}/middleArea/footerComponent";
import Image from "next/image";
import {Root} from "@/app/{services}/types";
import {useDefaultImage} from "@/app/{hooks}/useDefaultImage";

const AlbumBoardComponent = (props: Root.BoardListI) => {
    const { body } = props;

    const { defaultNoImg } = useDefaultImage();

    const extraValue = body?.filter((block) =>
        block.code === '00302'
    )[0].extraValue as ImageShowProps;

    let text = '';
    try {
        body!.forEach((block) => {
            const regex = '0{4}'
            if(!block.code.match(regex)) return;
            text += block.value + '\n';
        })
    } catch (e) {
        console.log(e)
    }

    return (
        <>
            <div className={'flex h-full'}>
                <div className={'relative min-w-[90px] max-w-[90px] sm:min-w-[120px] sm:max-w-[120px] h-full'}>
                    <Image className={'w-full h-full object-cover'}
                           src={defaultNoImg(extraValue?.images[extraValue.defaultIndex])}
                           height={100}
                           width={100}
                           alt={''}
                           priority={true}
                           onError={(e) => {
                               e.currentTarget.src = defaultNoImg('');
                           }}
                    />
                    <span className={'absolute z-10 bg-gray-500 text-white w-8 h-8 flex justify-center items-center text-xs right-0 bottom-0'}>
                        {extraValue.images.length}
                    </span>
                </div>

                <div className={'w-full h-full flex flex-col justify-between'}>
                    <HeaderComponent {...props} />
                    <div className={'p-3 flex flex-col h-auto'}>
                        <p className={'line-clamp-[3] text-xs break-all whitespace-pre-line'}>
                            {text}
                        </p>
                    </div>
                    <FooterComponent {...props} />
                </div>
            </div>
        </>
    )
}

export default AlbumBoardComponent;