import InputBlock from "@/app/{commons}/{components}/block/input/InputBlock";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import {faHeading} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

export type BlockType = {
    code       : string;
    tag        : string;
    command    : string;
    icon       : IconDefinition ;
    label      : string;
    comment    : string;
}

export type BlockComponentType = BlockType & {
    component: (props: BlockProps) => JSX.Element;
}

export const blockTypeList: BlockComponentType[] = [
    {
        code: '00001',
        tag: 'h1',
        label: 'Heading 1',
        icon: faHeading,
        comment: '세션 제목',
        command: '/h1',
        component: (props: BlockProps) => InputBlock(props, {
            fontSize: '2.4rem',
            fontWeight: '700',
            padding: '0.5rem 0.5rem',
            letterSpacing: '0.03rem',
        }),
    },
    {
        code: '00002',
        tag: 'h2',
        command: '/h2',
        label: 'Heading 2',
        icon: faHeading,
        comment: '세션 부제목',
        component: (props: BlockProps) => InputBlock(props, {
            fontSize: '1.8rem',
            fontWeight: '600',
            padding: '0.5rem 0.5rem',
            letterSpacing: '0.03rem',
        }),
    },
    {
        code: '00003',
        tag: 'h3',
        command: '/h3',
        label: 'Heading 3',
        icon: faHeading,
        comment: '세션 본문 제목',
        component: (props: BlockProps) => InputBlock(props, {
            fontSize: '1.4rem',
            fontWeight: '500',
            padding: '0.5rem 0.5rem',
            letterSpacing: '0.03rem',
        })
    },
    {
        code: '00004',
        tag: 'h4',
        command: '/h4',
        label: 'Heading 4',
        icon: faHeading,
        comment: '세션 본문 내용',
        component: (props: BlockProps) => InputBlock(props, {
            fontSize: '1.2rem',
            padding: '0.5rem 0.5rem',
            letterSpacing: '0.03rem',
        })
    },
    {
        code: '00005',
        tag: 'h5',
        command: '/h5',
        label: 'Heading 5',
        icon: faHeading,
        comment: '세션 본문 작은 내용',
        component: (props: BlockProps) => InputBlock(props, {
            fontSize: '1rem',
            padding: '0.5rem 0.5rem',
            letterSpacing: '0.03rem',
        })
    },
]