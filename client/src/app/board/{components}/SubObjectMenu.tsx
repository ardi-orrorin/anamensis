import React, {useContext} from "react";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import {faEye, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const SubObjectMenu = ({
    onClick,
    isView
}:{
    isView: boolean;
    onClick: (type: string, value: string) => void;
}) => {

    const {blockService, setBlockService} = useContext(BlockProvider);

    return (
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
                <li>
                    <button className={'w-10 h-10 bg-white hover:bg-blue-50 duration-300'}
                            title={'원본 보기'}
                            onClick={() => onClick('detailView', '')}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                </li>
            </ul>
    );
}
export default SubObjectMenu;