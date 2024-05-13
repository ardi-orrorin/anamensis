import {BlockType, blockTypeList} from "@/app/{commons}/{components}/block/list";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

const MenuItem = ({
    onClick
}:{
    onClick     : (code: string) => void
}) => {

    return (
        <ul className={'flex flex-col w-full'}>
            {
                blockTypeList.map((block: BlockType, index: number) => {
                    const {label, code, comment, command, icon} = block;
                    return (
                        <li key={'blockList'+ index} className={'w-full'}>
                            <button className={'flex w-full h-full p-2 text-left text-sm hover:bg-blue-200 hover:text-blue-800'}
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
    )
}

export default MenuItem;