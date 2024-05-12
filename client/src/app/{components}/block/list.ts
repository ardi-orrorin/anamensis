import InputBlock from "@/app/{components}/block/input/InputBlock";
import {BlockProps} from "@/app/{components}/block/type/Types";

export const blockList = [
    {
        code: '00001',
        tag: 'h1',
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
        component: (props: BlockProps) => InputBlock(props, {
            fontSize: '1.2rem',
            padding: '0.5rem 0.5rem',
            letterSpacing: '0.03rem',
        })
    },
    {
        code: '00005',
        tag: 'h5',
        component: (props: BlockProps) => InputBlock(props, {
            fontSize: '1rem',
            padding: '0.5rem 0.5rem',
            letterSpacing: '0.03rem',
        })
    },
]