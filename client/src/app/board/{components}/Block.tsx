'use client';

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {faEllipsisVertical} from "@fortawesome/free-solid-svg-icons";
import {blockTypeList} from "@/app/{components}/block/list";
import {BlockProps, MenuParams} from "@/app/{components}/block/type/Types";

export default function Block(props: BlockProps) {
    const component = blockTypeList.find(b=>
        b.code === props.code
    )?.component(props)

    return (
        <div className={'flex relative'}>
            {
                !props.isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={props.onClickAddHandler}
                >
                  <FontAwesomeIcon icon={faPlus} height={20} />
                </button>
            }
            {
                !props.isView &&
                <button className={'w-8 h-full flex justify-center items-center text-gray-600 hover:text-gray-950'}
                        onClick={()=> props.openMenuToggle({label: '', code: ''})}
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} height={20} />
                </button>
            }
            <div className={`w-full h-full flex items-center rounded`}>
                { component }
            </div>

            {
                props.openMenu &&
                <div className={'absolute top-8 left-3 bg-blue-100 z-10 w-32 max-h-52 duration-500 overflow-y-scroll rounded'}>
                    <ul className={'flex flex-col w-full text-blue-700'}>
                        {
                            blockTypeList.map((item, index) => {
                                return (
                                    <MenuItem key={index}
                                              label={item.label}
                                              code={item.code}
                                              onClick={({label, code}) => props.openMenuToggle({label, code})}
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
    code
} : {
    label: string,
    code: string,
    onClick: ({label, code}:MenuParams) => void
}) => {
    return (
        <li className={'w-full'}>
            <button className={'w-full ps-3 h-8 text-left text-sm'}
                    onClick={()=> onClick({label, code})}
            >
                {label}
            </button>
        </li>
    )
}