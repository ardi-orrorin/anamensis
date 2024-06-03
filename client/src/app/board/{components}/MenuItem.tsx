import {BlockType, blockTypeList} from "@/app/board/{components}/block/list";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {MutableRefObject, useCallback, useContext, useMemo} from "react";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import {ToggleEnum} from "@/app/board/{components}/SubTextMenu";
import BoardProvider from "@/app/board/{services}/BoardProvider";

const MenuItem = ({
    seq,
    subMenu,
    toggle,
    blockRef,
}:{
    seq      : number,
    blockRef : MutableRefObject<HTMLElement[] | null[]>;
    toggle?  : ToggleEnum,
    subMenu? : boolean,
}) => {

    const {blockService, setBlockService} = useContext(BlockProvider);
    const {board, setBoard} = useContext(BoardProvider);

    const curCode = useMemo(() => {
        const item = board.data?.content?.list.find(item => item.seq === seq);
        return item?.code;
    },[board.data?.content?.list, seq]) as string;

    const onCloseHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setBlockService({...blockService, blockMenu: ''})
    }

    const openMenuClick = (code: string) => {
        if(!code || code === '') return ;

        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                if(item.code.slice(0, 3) !== code.slice(0, 3)) {
                    item.extraValue = {};
                    item.textStyle = {};
                }
                item.code = code;
            }
            return item;
        });

        setBlockService({
            ...blockService,
            blockMenu: '',
            block: {
                seq: 0,
                code: '',
                value: '',
            }});

        setBoard({...board, data: {...board.data, content: {list: newList}}});

        setTimeout(() => {
            blockRef?.current[seq]?.focus();
        },100);
    };

    return (
        <>
            <div className={[
                'absolute flex z-20 bg-white w-56 duration-500 overflow-hidden touch-auto rounded ',
                subMenu ? toggle === 'blockMenu'
                    ? 'max-h-72 overflow-y-scroll shadow' : 'max-h-0'
                    : 'top-10 left-3 max-h-80 shadow-xl'
            ].join(' ')}>
                <div className={[
                    'flex flex-col w-full duration-500',
                    subMenu ? '' : 'overflow-y-scroll scroll-p-2 max-h-72'
                ].join(' ')}>
                    <ul className={'flex flex-col w-full'}>
                        {
                            blockTypeList.map((block: BlockType, index: number) => {
                                const {
                                    label, code,
                                    comment, command,
                                    icon
                                } = block;
                                return (
                                    <li key={'blockList'+ index} className={'w-full'}>
                                        <button className={[
                                            'flex w-full h-full p-2 text-left text-sm rounded duration-300 hover:bg-blue-200 hover:text-blue-800',
                                            curCode === code && 'bg-blue-100'
                                        ].join(' ')}
                                                onClick={()=> openMenuClick(code)}
                                        >
                                            <div className={'flex flex-col h-full p-2'}>
                                                <FontAwesomeIcon icon={icon} height={15}/>
                                                <div>[{command}]</div>
                                            </div>
                                            <div className={'flex flex-col w-full p-1'}>
                                                <div>
                                                    {label}
                                                </div>
                                                <div>
                                                    {comment}
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            {
                !subMenu &&
                <div className={'fixed left-0 top-0 w-full h-full'}
                     onClick={onCloseHandler}
                />
            }
        </>
    )
}

export default MenuItem;