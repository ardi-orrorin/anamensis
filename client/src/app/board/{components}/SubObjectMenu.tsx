import React from "react";
import {faEye, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useBlockEvent} from "@/app/board/{hooks}/useBlockEvent";

const SubObjectMenu = ({
    onClick,
    isView,
    value,
}:{
    isView: boolean;
    value: string;
    onClick: (type: string, value: string) => void;
}) => {

    const {blockService, setBlockService} = useBlockEvent();

    return (
        <div className={'absolute bottom-[5%] right-[5%] bg-gray-100 z-10 max-h-80 duration-500 rounded shadow-md'}>
            <ul className={'flex overflow-hidden rounded text-sm bg-white shadow-md'}
                onMouseEnter={() => setBlockService({...blockService, blockMenu: 'openObjectMenu'})}
            >
                {
                    !isView
                    && <li>
                        <button className={'w-10 h-10 bg-white hover:bg-blue-50 duration-300'}
                                title={'삭제'}
                                onClick={() => onClick('delete', '')}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                   </li>
                }
                {
                    value
                    && <li>
                        <button className={'w-10 h-10 bg-white hover:bg-blue-50 duration-300'}
                                title={'원본 보기'}
                                onClick={() => onClick('detailView', '')}
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                   </li>
                }

            </ul>
        </div>
    );
}
export default SubObjectMenu;