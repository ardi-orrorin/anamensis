'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeList} from "@/app/{commons}/{components}/block/list";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import React, {useContext} from "react";
import SubTextMenu from "@/app/board/{components}/SubTextMenu";
import MenuItem from "@/app/board/{components}/MenuItem";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import BoardProvider from "@/app/board/{services}/BoardProvider";

export default function Block(props: BlockProps) {
    const {
        seq,
        onClickAddHandler,
    } = props;

    const {board, setBoard} = useContext(BoardProvider);
    const {blockService, setBlockService} = useContext(BlockProvider);

    const onMouseEnterHandler = () => {
        setBlockService({...blockService, blockMenu: 'openTextMenu', seq})
    }

    const openMenuToggle  = () => {
        if(blockService.blockMenu !== 'openMenu' || blockService.seq !== seq) {
            setBlockService({...blockService, blockMenu: 'openMenu', seq});
            return ;
        }

        setBlockService({...blockService, blockMenu: '', seq: 0});
    }

    const openMenuClick = (code: string) => {
        if(!code || code === '') return ;

        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.code = code;
            }
            return item;
        });

        setBlockService({...blockService, blockMenu: '', seq: 0});
        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }

    const onClickSubTextMenu = (e: React.MouseEvent<HTMLButtonElement>, code: string) => {
        console.log(e, code, seq);
    }

    return (
        <div className={'flex relative'}>
            {
                !board.isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={onClickAddHandler}
                >
                  <FontAwesomeIcon icon={faPlus} height={20} />
                </button>
            }
            {
                !board.isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={()=> openMenuToggle()}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} height={20} />
                </button>
            }
            <div className={`relative w-full h-full flex items-center rounded`}>
                {
                    !board.isView
                    && blockService.blockMenu === 'openTextMenu'
                    && blockService.seq === seq
                    && <div className={'absolute -top-8 left-0 md:left-1/3 bg-gray-100 z-20 w-auto max-h-52 duration-500 rounded'}>
                    <SubTextMenu onClick={onClickSubTextMenu} />
                  </div>
                }
                {
                    blockTypeList.find(b=> b.code === props.code)
                        ?.component({
                            ...props,
                            isView: board.isView,
                            onMouseEnterHandler,
                        })
                }
            </div>
            {
                !board.isView
                && blockService.blockMenu === 'openMenu'
                && blockService.seq === seq
                && <div className={'absolute top-10 left-3 bg-gray-100 z-10 w-56 max-h-80 duration-500 overflow-y-scroll rounded shadow-md'}>
                  <MenuItem onClick={openMenuClick} />
                </div>
            }
        </div>
    )
}


