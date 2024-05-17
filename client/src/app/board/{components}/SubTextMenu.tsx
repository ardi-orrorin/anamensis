import React, {useContext} from "react";
import {faBold, faItalic} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import {TextStylesType} from "@/app/board/{services}/types";

const SubTextMenu = ({
    textStyle,
    onClick,
}: {
    textStyle : TextStylesType
    onClick   : (type: string, value: string) => void
}) => {

    const {blockService, setBlockService} = useContext(BlockProvider);
    const fontWeight = '700';
    const buttonStyle = 'py-2 px-3 h-full hover:bg-blue-50 hover:text-black duration-300 outline-0 '

    const onMouseLeave = () => {
        setBlockService({...blockService, blockMenu: 'openMenu'})
    }

    const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onClick(e.target.name, e.target.value)
    }

    const selectFontStyle = (type: string, value:string) => {
        value = textStyle[type] === value ? '' : value;
        onClick(type, value)
    }

    return (
        <ul className={'flex overflow-hidden rounded text-sm bg-white'}
            onMouseLeave={onMouseLeave}
        >
            <li>
                <select className={buttonStyle + (textStyle.fontSize && textStyle.fontSize !== '' ?  'bg-blue-400 text-white' : 'bg-white')}
                        value={textStyle.fontSize ?? ''}
                        name={'fontSize'}
                        onChange={selectChangeHandler}
                >
                    <option value={''}>글자크기</option>
                    {
                        fontSize.map((size, index) => {
                            return (
                                <option key={'fontSize' + index}
                                        value={size.value ?? ''}
                                >{size.value}
                                </option>
                            )
                        })
                    }
                </select>
            </li>
            <li>
               <select className={buttonStyle + (textStyle.color && textStyle.color !== '' ?  'bg-blue-400 text-white' : 'bg-white')}
                       name={'color'}
                       value={textStyle.color ?? ''}
                       onChange={selectChangeHandler}
               >
                   <option value={''}>글자색</option>
                   {
                       fontColor.map((color, index) => {
                           return (
                               <option key={'fontColor' + index}
                                       value={color.value}
                               >{color.value}
                               </option>
                           )
                       })
                   }
               </select>
            </li>
            <li>
                <select className={buttonStyle + (textStyle.backgroundColor && textStyle.backgroundColor !== '' ?  'bg-blue-400 text-white' : 'bg-white')}
                        name={'backgroundColor'}
                        value={textStyle.backgroundColor ?? ''}
                        onChange={selectChangeHandler}
                >
                    <option value={''}>배경색</option>
                    {
                        backgroundColor.map((color, index) => {
                            return (
                                <option key={'backgroundColor' + index}
                                        value={color.value}
                                >{color.value}
                                </option>
                            )
                        })
                    }
                </select>
            </li>
            <li>
                <button className={buttonStyle + (textStyle.fontStyle === 'Italic' ? 'bg-blue-400 text-white' : 'bg-white')}
                        onClick={() => selectFontStyle('fontStyle', 'Italic')}
                >
                    <FontAwesomeIcon icon={faItalic} />
                </button>
            </li>
            <li>
                <button className={buttonStyle + (textStyle.fontWeight === fontWeight ? 'bg-blue-400 text-white' : 'bg-white')}
                        onClick={() => selectFontStyle('fontWeight', fontWeight)}
                >
                    <FontAwesomeIcon icon={faBold} />
                </button>
            </li>
            <li>
                <button className={buttonStyle + (Object.keys(textStyle).length > 0 ? 'bg-blue-400 text-white' : 'bg-white')}
                        onClick={() => selectFontStyle('', '')}
                >
                    초기화
                </button>
            </li>
        </ul>
    )
}

const fontSize = [
    {value: '10px'},
    {value: '12px'},
    {value: '14px'},
    {value: '16px'},
    {value: '18px'},
    {value: '20px'},
    {value: '24px'},
    {value: '32px'},
    {value: '40px'},
    {value: '48px'},
    {value: '64px'},
    {value: '80px'},
    {value: '100px'},
]

const fontColor = [
    {value: 'red'},
    {value: 'blue'},
    {value: 'green'},
    {value: 'yellow'},
    {value: 'orange'},
    {value: 'purple'},
    {value: 'black'},
    {value: 'white'},
];
const backgroundColor = [
    {value: 'red'},
    {value: 'blue'},
    {value: 'green'},
    {value: 'yellow'},
    {value: 'orange'},
    {value: 'purple'},
    {value: 'black'},
    {value: 'white'},
];

export default SubTextMenu;