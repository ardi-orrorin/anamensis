import React, {useContext} from "react";
import {faBold, faItalic} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BlockProvider from "@/app/board/{services}/BlockProvider";


const SubTextMenu = ({
    onClick,
}: {
    onClick: (e: React.MouseEvent<HTMLButtonElement>, code: string) => void
}) => {

    const {blockService, setBlockService} = useContext(BlockProvider);
    const buttonStyle = 'py-2 px-3 bg-white hover:bg-blue-50 duration-300 outline-0'


    const onMouseLeave = () => {
        setBlockService({...blockService, blockMenu: 'openMenu'})
    }

    return (
        <ul className={'flex overflow-hidden rounded text-sm bg-white shadow-md'}
            onMouseLeave={onMouseLeave}
        >
            <li>
                <select className={buttonStyle}>
                    <option>글자크기</option>
                    <option>10px</option>
                    <option>12px</option>
                    <option>14px</option>
                    <option>16px</option>
                    <option>18px</option>
                    <option>20px</option>
                    <option>40px</option>
                    <option>80px</option>
                </select>
            </li>
            <li>
               <select className={buttonStyle}>
                   <option>글자색</option>
                   <option>red</option>
                   <option>blue</option>
                   <option>green</option>
                   <option>yellow</option>
                   <option>orange</option>
                   <option>purple</option>
                   <option>black</option>
                   <option>white</option>
               </select>
            </li>
            <li>
                <select className={buttonStyle}>
                    <option>배경색</option>
                    <option>red</option>
                    <option>blue</option>
                    <option>green</option>
                    <option>yellow</option>
                    <option>orange</option>
                    <option>purple</option>
                    <option>black</option>
                    <option>white</option>
                </select>
            </li>
            <li>
                <button className={buttonStyle}
                        onClick={e=> onClick(e, 'fontStyle')}
                >
                    <FontAwesomeIcon icon={faItalic} />
                </button>
            </li>
            <li>
                <button className={buttonStyle}
                        onClick={e=> onClick(e, 'fontWeight')}
                >
                    <FontAwesomeIcon icon={faBold} />
                </button>
            </li>
        </ul>
    )
}

export default SubTextMenu;