import {BlockType, blockTypeFlatList} from "@/app/board/{components}/block/list";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {MutableRefObject, useContext, useMemo} from "react";
import {ToggleEnum} from "@/app/board/{components}/SubTextMenu";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import {notAvailDupCheck, onChangeBlockGlobalHandler} from "@/app/board/{services}/funcs";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {useBlockEvent} from "@/app/board/{hooks}/useBlockEvent";

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
    const {
        onClose, setInitBlock,
        setInitBlockMenu,
    } = useBlockEvent();

    const {board, setBoard,isTemplate} = useContext(BoardProvider);

    const curCode = useMemo(() => {
        const item = board.data?.content?.list.find(item => item.seq === seq);
        return item?.code;
    },[board.data?.content?.list, seq]) as string;

    const openMenuClick = (code: string) => {
        if(!code || code === '') return ;

        onChangeBlockGlobalHandler({
            seq,
            code,
            board,
            setBoard,
            blockRef,
            isTemplate,
        });

        setInitBlock();
    };

    const blockMenu = useMemo(() =>
        blockTypeFlatList.map((block: BlockType, index: number) => {
            const {
                label, code,
                comment, command,
                icon, notAvailDup
            } = block;

            if(isTemplate && !block?.onTemplate) return;
            if(notAvailDupCheck(code, board.data?.content)) return;
            if(block.type === 'extra' || block.type === 'subExtra') return;

            return (
                <Item key={'blockList' + index}
                      {...{curCode, code, icon, command, label, comment}}
                      onClick={() => openMenuClick(code)}
                      />
            )
        })
    ,[seq, board]);

    const subBlockMenu = useMemo(() => {
        const firstBlockCode = board.data.content.list[0].code;
        const subComponents = blockTypeFlatList.find(block =>
            block.code === firstBlockCode)?.subBlock;

        if(!subComponents || subComponents?.length === 0) return;

        return subComponents.map((block: BlockType, index: number) => {
            const {
                label, code,
                comment, command,
                icon, notAvailDup
            } = block;

            if(isTemplate && !block?.onTemplate) return;
            if(notAvailDupCheck(code, board.data?.content)) return;
            if(block.type !== 'subExtra') return;

            return (
                <Item key={'subBlockList' + index}
                      onClick={() => openMenuClick(code)}
                      {...{curCode, code, icon, command, label, comment}}
                />
            )
        });
    },[board.data.content.list]);

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
                        { blockMenu }
                        { subBlockMenu }
                    </ul>
                </div>
            </div>
            {
                !subMenu &&
                <div className={'fixed left-0 top-0 w-full h-full'}
                     onClick={onClose}
                />
            }

            <div className={'z-[10] fixed w-full h-full'}
                 onClick={() => setInitBlockMenu()}
            ></div>
        </>
    )
}


const Item = ({
    curCode, code,
    onClick, icon,
    command, label, comment
}: {
    curCode: string,
    code: string,
    onClick: () => void,
    icon: IconDefinition,
    command: string,
    label: string,
    comment: string
}) => {
    return (
        <li className={"w-full"}>
            <button className={[
                "flex w-full h-full p-2 text-left text-sm rounded duration-300 hover:bg-blue-200 hover:text-blue-800",
                curCode === code && "bg-blue-100"
            ].join(" ")}
                    onClick={onClick}
            >
                <div className={"flex flex-col h-full p-2"}>
                    <FontAwesomeIcon icon={icon} height={15}/>
                    <div>[{command}]</div>
                </div>
                <div className={"flex flex-col w-full p-1"}>
                    <div>
                        {label}
                    </div>
                    <div>
                        {comment}
                    </div>
                </div>
            </button>
        </li>
    );
}

export default MenuItem;