import {BoardListI} from "@/app/{components}/boardComponent";
import {ImageShowProps} from "@/app/board/{components}/block/extra/albumBlock";
import HeaderComponent from "@/app/{components}/headerComponent";
import {defaultNoImg} from "@/app/{commons}/func/image";
import FooterComponent from "@/app/{components}/footerComponent";

const AlbumBoardComponent = (props: BoardListI) => {
    const { body } = props;

    const albumBlock = body?.filter((block) =>
        block.code === '00302'
    )[0];

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

    const extraValue = albumBlock?.extraValue as ImageShowProps;


    return (
        <>
            <div className={'flex h-full'}>
                <div className={'relative min-w-[30%] max-w-[30%] sm:min-w-[30%] sm:max-w-[30%] h-full'}>
                    <img className={'w-full h-full object-cover'}
                         src={defaultNoImg(extraValue?.images[extraValue.defaultIndex])}
                         alt={''}
                         onError={(e) => {
                             (e.target as HTMLImageElement).src = process.env.NEXT_PUBLIC_CDN_SERVER + '/noimage.jpg'
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