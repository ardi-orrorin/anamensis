import {BlockType, blockTypeList} from "@/app/{commons}/{components}/block/list";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext} from "react";
import BlockProvider from "@/app/board/{services}/BlockProvider";

const MenuItem = ({
    onClick
}:{
    onClick     : (code: string) => void
}) => {

    const {blockService, setBlockService} = useContext(BlockProvider);

    const onCloseHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setBlockService({...blockService, blockMenu: ''})

    }
    return (
        <>
            <div className={'absolute z-30 top-10 left-3 bg-white w-56 max-h-80 duration-500 px-2 py-4 overflow-hidden touch-auto rounded shadow-xl'}>
                <div className={'flex flex-col w-full max-h-72 overflow-y-scroll scroll-smooth scroll-p-2'}>
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
                                        <button className={'flex w-full h-full p-2 text-left text-sm rounded duration-300 hover:bg-blue-200 hover:text-blue-800'}
                                                onClick={()=> onClick(code)}
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
            <div className={'fixed left-0 top-0 w-full h-full'}
                 onClick={onCloseHandler}
            />
        </>
    )
}

export default MenuItem;