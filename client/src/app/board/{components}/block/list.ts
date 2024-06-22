import InputBlock from "@/app/board/{components}/block/input/InputBlock";
import {BlockProps} from "@/app/board/{components}/block/type/Types";
import {faHeading, faImage, faLink, faList, faPercent, faQuoteLeft} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import FileBlock from "@/app/board/{components}/block/file/fileBlock";
import LinkBlock from "@/app/board/{components}/block/input/linkBlock";
import FileImage from "@/app/board/{components}/block/file/fileImage";
import CheckBlock from "@/app/board/{components}/block/input/CheckBlock";
import AlttuelBlock from "@/app/board/{components}/block/extra/alttuelBlock";
import {faImages} from "@fortawesome/free-solid-svg-icons/faImages";
import AlbumBlock from "@/app/board/{components}/block/extra/albumBlock";

export type BlockType = {
    code         : string;
    tag          : string;
    command      : string;
    icon         : IconDefinition;
    label        : string;
    comment      : string;
    notAvailDup  : boolean;
    type         : 'text' | 'object';
}

export type BlockComponentType = BlockType & {
    component         : (props: BlockProps)  => JSX.Element;
}

export const blockTypeList: BlockComponentType[] = [
    {
        code              : '00001',
        tag               : 'h1',
        label             : 'Heading 1',
        icon              : faHeading,
        comment           : '세션 제목',
        command           : '/h1',
        type              : 'text',
        notAvailDup       : false,
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '2.4rem',
            fontWeight    : '700',
            letterSpacing : '0.03rem',
            padding       : '0.5rem',
        }),
    },
    {
        code              : '00002',
        tag               : 'h2',
        command           : '/h2',
        label             : 'Heading 2',
        icon              : faHeading,
        comment           : '세션 부제목',
        type              : 'text',
        notAvailDup       : false,
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '1.8rem',
            fontWeight    : '600',
            letterSpacing : '0.03rem',
            padding       : '0.5rem',
        }),
    },
    {
        code              : '00003',
        tag               : 'h3',
        command           : '/h3',
        label             : 'Heading 3',
        icon              : faHeading,
        comment           : '세션 본문 제목',
        type              : 'text',
        notAvailDup       : false,
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '1.2rem',
            fontWeight    : '500',
            letterSpacing : '0.03rem',
            padding       : '0.5rem',

        }),
    },
    {
        code              : '00004',
        tag               : 'h4',
        command           : '/h4',
        label             : 'Heading 4',
        icon              : faHeading,
        comment           : '세션 본문 내용',
        type              : 'text',
        notAvailDup       : false,
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '1rem',
            letterSpacing : '0.03rem',
            padding       : '0.5rem',
        }),
    },
    {
        code              : '00005',
        tag               : 'h5',
        command           : '/h5',
        label             : 'Heading 5',
        icon              : faHeading,
        comment           : '세션 본문 작은 내용',
        type              : 'text',
        notAvailDup       : false,
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '0.8rem',
            letterSpacing : '0.03rem',
            padding       : '0.5rem',
        }),
    },
    {
        code              : '00006',
        tag               : 'quo',
        command           : '/quo',
        label             : 'Quotation',
        icon              : faQuoteLeft,
        comment           : '인용',
        type              : 'text',
        notAvailDup       : false,
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '1rem',
            padding       : '1rem 0.5rem 1rem 1.3rem',
            letterSpacing : '0.03rem',
            borderLeft    : '0.8rem solid #BBBBBB',
            height        : 'auto',
        }),
    },
    {
        code              : '00101',
        tag               : 'link',
        command           : '/link',
        label             : 'Link',
        icon              : faLink,
        comment           : '링크',
        type              : 'object',
        notAvailDup       : false,
        component         : (props: BlockProps)  => LinkBlock(props),
    },
    {
        code              : '00111',
        tag               : 'todo',
        command           : '/todo',
        label             : 'Todo',
        icon              : faList,
        comment           : '할일',
        type              : 'object',
        notAvailDup       : false,
        component         : (props: BlockProps)  => CheckBlock(props),
    },
    {
        code              : '00201',
        tag               : 'image',
        command           : '/img',
        label             : 'Image',
        icon              : faImage,
        comment           : '이미지',
        type              : 'object',
        notAvailDup       : false,
        component         : (props: BlockProps)  => FileBlock({
            ...props,
            Component     : FileImage
        }),
    },
    // {
    //     code              : '00202',
    //     tag               : 'fileUpload',
    //     command           : '/file',
    //     label             : 'fileUplaod',
    //     icon              : faFile,
    //     comment           : '파일 업로드',
    //     type              : 'object',
    //     component         : (props: BlockProps)  => FileBlock({
    //         ...props,
    //         Component     : FileFile
    //     }),
    // },
    {
        code              : '00301',
        tag               : 'alttuel',
        command           : '/alttuel',
        label             : 'alttuel',
        icon              : faPercent,
        comment           : '판매정보',
        type              : 'object',
        notAvailDup       : true,
        component         : (props: BlockProps)  => AlttuelBlock(props),
    },
    {
        code              : '00302',
        tag               : 'album',
        command           : '/album',
        label             : 'album',
        icon              : faImages,
        comment           : '앨범',
        type              : 'object',
        notAvailDup       : true,
        component         : (props: BlockProps)  => AlbumBlock(props),
    },
]