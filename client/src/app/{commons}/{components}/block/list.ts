import InputBlock from "@/app/{commons}/{components}/block/input/InputBlock";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import {faFile, faHeading, faImage, faLink, faList, faQuoteLeft} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import FileBlock from "@/app/{commons}/{components}/block/file/fileBlock";
import LinkBlock from "@/app/{commons}/{components}/block/input/linkBlock";
import {TextStylesType} from "@/app/board/{services}/types";
import SubTextMenu from "@/app/board/{components}/SubTextMenu";
import SubObjectMenu from "@/app/board/{components}/SubObjectMenu";
import FileFile from "@/app/{commons}/{components}/block/file/fileFile";
import FileImage from "@/app/{commons}/{components}/block/file/fileImage";
import CheckBlock from "@/app/{commons}/{components}/block/input/CheckBlock";

export type BlockType = {
    code       : string;
    tag        : string;
    command    : string;
    icon       : IconDefinition;
    label      : string;
    comment    : string;
    type       : 'text' | 'object';
}

export type SubMenuType = {
    value     : string;
    isView    : boolean;
    textStyle : TextStylesType,
    onClick   : (type: string, value: string) => void
}

export type BlockComponentType = BlockType & {
    component         : (props: BlockProps)  => JSX.Element;
    subMenuComponent  : (props: SubMenuType) => JSX.Element;
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
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '2.4rem',
            fontWeight    : '700',
            padding       : '0.5rem',
            letterSpacing : '0.03rem',
        }),
        subMenuComponent  : (props: SubMenuType) => SubTextMenu(props),
    },
    {
        code              : '00002',
        tag               : 'h2',
        command           : '/h2',
        label             : 'Heading 2',
        icon              : faHeading,
        comment           : '세션 부제목',
        type              : 'text',
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '1.8rem',
            fontWeight    : '600',
            padding       : '0.5rem',
            letterSpacing : '0.03rem',
        }),
        subMenuComponent  : (props: SubMenuType) => SubTextMenu(props),
    },
    {
        code              : '00003',
        tag               : 'h3',
        command           : '/h3',
        label             : 'Heading 3',
        icon              : faHeading,
        comment           : '세션 본문 제목',
        type              : 'text',
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '1.2rem',
            fontWeight    : '500',
            padding       : '0.5rem',
            letterSpacing : '0.03rem',
        }),
        subMenuComponent  : (props: SubMenuType) => SubTextMenu(props),
    },
    {
        code              : '00004',
        tag               : 'h4',
        command           : '/h4',
        label             : 'Heading 4',
        icon              : faHeading,
        comment           : '세션 본문 내용',
        type              : 'text',
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '1rem',
            padding       : '0.5rem',
            letterSpacing : '0.03rem',
        }),
        subMenuComponent  : (props: SubMenuType) => SubTextMenu(props),
    },
    {
        code              : '00005',
        tag               : 'h5',
        command           : '/h5',
        label             : 'Heading 5',
        icon              : faHeading,
        comment           : '세션 본문 작은 내용',
        type              : 'text',
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '0.8rem',
            padding       : '0.5rem',
            letterSpacing : '0.03rem',
        }),
        subMenuComponent  : (props: SubMenuType) => SubTextMenu(props),
    },
    {
        code              : '00006',
        tag               : 'link',
        command           : '/link',
        label             : 'Link',
        icon              : faLink,
        comment           : '링크',
        type              : 'text',
        component         : (props: BlockProps)  => LinkBlock(props),
        subMenuComponent  : (props: SubMenuType) => SubTextMenu(props),
    },
    {
        code              : '00007',
        tag               : 'quo',
        command           : '/quo',
        label             : 'Quotation',
        icon              : faQuoteLeft,
        comment           : '인용',
        type              : 'text',
        component         : (props: BlockProps)  => InputBlock(props, {
            fontSize      : '1rem',
            padding       : '1rem 0.5rem 1rem 1.3rem',
            letterSpacing : '0.03rem',
            borderLeft    : '0.8rem solid #BBBBBB',
            height        : 'auto',
        }),
        subMenuComponent  : (props: SubMenuType) => SubTextMenu(props),
    },
    {
        code              : '00008',
        tag               : 'todo',
        command           : '/todo',
        label             : 'Todo',
        icon              : faList,
        comment           : '할일',
        type              : 'text',
        component         : (props: BlockProps)  => CheckBlock(props),
        subMenuComponent  : (props: SubMenuType) => SubTextMenu(props),
    },
    {
        code              : '00101',
        tag               : 'image',
        command           : '/img',
        label             : 'Image',
        icon              : faImage,
        comment           : '이미지',
        type              : 'object',
        component         : (props: BlockProps)  => FileBlock({
            ...props,
            Component     : FileImage
        }),
        subMenuComponent  : (props: SubMenuType) => SubObjectMenu(props),
    },
    {
        code              : '00102',
        tag               : 'fileUpload',
        command           : '/file',
        label             : 'fileUplaod',
        icon              : faFile,
        comment           : '파일 업로드',
        type              : 'object',
        component         : (props: BlockProps)  => FileBlock({
            ...props,
            Component     : FileFile
        }),
        subMenuComponent  : (props: SubMenuType) => SubObjectMenu(props),
    },
]