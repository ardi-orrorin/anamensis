import React, {useContext} from "react";
import {faBold, faItalic, faTextSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import BlockProvider from "@/app/board/{services}/BlockProvider";
import {TextStylesType} from "@/app/board/{services}/types";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";

const SubTextMenu = ({
    isView,
    textStyle,
    onClick,
    value,
}: {
    value     : string;
    isView    : boolean;
    textStyle : TextStylesType
    onClick   : (type: string, value: string) => void
}) => {

    const {blockService, setBlockService} = useContext(BlockProvider);

    if(isView) return <></>

    const buttonStyle = 'py-2 px-3 h-full hover:bg-blue-50 hover:text-black duration-300 outline-0 '

    const selectChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onClick(e.target.name, e.target.value)
    }

    const selectFontStyle = (type: string, value:string) => {
        value = textStyle[type] === value ? '' : value;
        onClick(type, value)
    }


    return (
        <div className={`fixed bg-gray-100 z-20 w-auto max-h-52 duration-500 rounded shadow-md`}
             style={{top: blockService.screenY, left: blockService.screenX}}
        >
            <ul className={'flex overflow-hidden rounded text-sm bg-white'}>
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
                           colorSet.map((color, index) => {
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
                            colorSet.map((color, index) => {
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
                {
                    fontStyle.map((style, index) => {
                        return (
                            <li key={'fontStyle' + index}>
                                <button className={buttonStyle + (textStyle[style.style] === style.value ? 'bg-blue-400 text-white' : 'bg-white')}
                                        onClick={() => selectFontStyle(style.style, style.value)}
                                >
                                    <FontAwesomeIcon icon={style.icon} />
                                </button>
                            </li>
                        )
                    })
                }
                <li>
                    <button className={['min-w-16',buttonStyle + (Object.keys(textStyle).length > 0 ? 'bg-blue-400 text-white' : 'bg-white')].join(' ')}
                            onClick={() => selectFontStyle('', '')}
                    >
                        초기화
                    </button>
                </li>
            </ul>
        </div>
    )
}

const fontStyle = [
    {icon : faBold, style: 'fontWeight', value: '700'},
    {icon : faItalic, style: 'fontStyle', value: 'Italic'},
    {icon : faTextSlash, style: 'textDecoration', value: 'line-through'},
]

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

const colorSet  = [
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