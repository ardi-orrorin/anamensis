'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeList} from "@/app/{commons}/{components}/block/list";
import {BlockProps, MenuParams} from "@/app/{commons}/{components}/block/type/Types";

export default function Block(props: BlockProps) {
    const {isView, openMenuToggle, onClickAddHandler, openMenu} = props;
    return (
        <div className={'flex relative'}>
            {
                !isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={onClickAddHandler}
                >
                  <FontAwesomeIcon icon={faPlus} height={20} />
                </button>
            }
            {
                !isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={()=> openMenuToggle!({label: '', code: ''})}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} height={20} />
                </button>
            }
            <div className={`w-full h-full flex items-center rounded`}>
                {
                    blockTypeList.find(b=> b.code === props.code)
                        ?.component(props)
                }
            </div>
            {
                openMenu &&
                <div className={'absolute top-10 left-3 bg-blue-100 z-10 w-56 max-h-52 duration-500 overflow-y-scroll rounded'}>
                    <ul className={'flex flex-col w-full text-blue-700'}>
                        {
                            blockTypeList.map((item, index) => {
                                return (
                                    <MenuItem key={'menuItem' + index}
                                              label={item.label}
                                              code={item.code}
                                              command={item.command}
                                              onClick={({label, code}) =>
                                                  openMenuToggle!({label, code})
                                              }
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
            }
        </div>
    )
}

const MenuItem = ({
    label,
    onClick,
    code,
    command
} : {
    label       : string,
    code        : string,
    command : string,
    onClick     : ({label, code}:MenuParams) => void
}) => {
    return (
        <li className={'w-full'}>
            <button className={'w-full ps-3 h-8 text-left text-sm'}
                    onClick={()=> onClick({label, code})}
            >
                [{command}] {label}
            </button>
        </li>
    )
}