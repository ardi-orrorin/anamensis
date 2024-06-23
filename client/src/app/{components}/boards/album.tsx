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

    const extraValue = albumBlock?.extraValue as ImageShowProps;

    return (
        <>
            <HeaderComponent {...props} />
            <div className={'flex h-auto'}>
                <img className={'w-full h-[150px] object-cover'}
                     src={defaultNoImg(extraValue.images[extraValue.defaultIndex])}
                     alt={''}
                     onError={(e) => {
                        (e.target as HTMLImageElement).src = process.env.NEXT_PUBLIC_CDN_SERVER + '/noimage.jpg'
                     }}
                />
            </div>
        </>
    )
}

export default AlbumBoardComponent;