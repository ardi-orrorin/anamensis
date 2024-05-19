'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeList} from "@/app/{commons}/{components}/block/list";
import {BlockProps} from "@/app/{commons}/{components}/block/type/Types";
import React, {useContext} from "react";
import SubTextMenu from "@/app/board/{components}/SubTextMenu";
import MenuItem from "@/app/board/{components}/MenuItem";
import BlockProvider, {BlockMenu} from "@/app/board/{services}/BlockProvider";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import SubObjectMenu from "@/app/board/{components}/SubObjectMenu";

export default function Block(props: BlockProps) {
    const {
        seq,
        textStyle,
        onClickAddHandler,
        onClickDeleteHandler,
        value,
    } = props;

    const {board, setBoard} = useContext(BoardProvider);
    const {blockService, setBlockService} = useContext(BlockProvider);

    const onMouseEnterHandler = (e: React.MouseEvent<HTMLInputElement | HTMLImageElement> ) => {
        let blockMenu: BlockMenu = '';
        if(e.target instanceof HTMLImageElement) {
            blockMenu = 'openObjectMenu';
        } else if(e.target instanceof HTMLInputElement) {
            blockMenu = 'openTextMenu';
        }

        setBlockService({...blockService, blockMenu: blockMenu, seq})
    }

    const onMouseLeaveHandler = (e: React.MouseEvent<HTMLImageElement | HTMLInputElement> ) => {
        setBlockService({blockMenu: '', seq: 0});
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
                if(item.code.slice(0, 3) !== code.slice(0, 3)) {
                    item.value = '';
                }
                item.code = code;
            }
            return item;
        });

        setBlockService({...blockService, blockMenu: '', seq: 0});
        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }

    const onClickSubTextMenu = (type: string, value: string) => {
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.textStyle = type === ''
                ? {}
                : {...item.textStyle, [type]: value};
            }
            return item;
        });
        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }

    const onClickObjectMenu = (type: string) => {
        if(type === 'delete') {
            if(!onClickDeleteHandler) return;
            onClickDeleteHandler(seq);

            return ;
        }
        if(type === 'detailView') {
            const url = process.env.NEXT_PUBLIC_CDN_SERVER + value;
            window.open(url, '_blank');
            return ;

        }

    }

    const onChangeValueHandler = (value: string) => {
        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq === seq) {
                item.value = value;
            }
            return item;
        });

        setBoard({...board, data: {...board.data, content: {list: newList}}});
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
                    && textStyle
                    && <div className={'absolute -top-8 left-0 md:left-1/4 bg-gray-100 z-20 w-auto max-h-52 duration-500 rounded  shadow-md'}>
                        <SubTextMenu textStyle={textStyle}
                                     onClick={onClickSubTextMenu}
                        />
                    </div>
                }
                {
                    blockService.blockMenu === 'openObjectMenu'
                    && blockService.seq === seq
                    && <div className={'absolute bottom-[5%] right-[5%] bg-gray-100 z-10 max-h-80 duration-500 rounded shadow-md'}>
                        <SubObjectMenu onClick={onClickObjectMenu}
                                       isView={board.isView}
                        />
                    </div>
                }
                {
                    blockTypeList.filter(b=> b.code === props.code)?.map(c => {
                        'use client'
                        const Component = c.component;
                        return <Component key={'block' + seq}
                                          {...props}
                                          isView={board.isView}
                                          onMouseEnterHandler={onMouseEnterHandler}
                                          onMouseLeaveHandler={onMouseLeaveHandler}
                                          onChangeValueHandler={onChangeValueHandler}
                        />
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


