import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {CheckProps, CheckType, UserProps} from "@/app/signup/page";
import {useState} from "react";

export type RowProps = {
    className?  : string;
    name        : string;
    value       : UserProps;
    check       : CheckProps;
    placeholder : string;
    setProps    : (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputCheck  : (eleId: CheckType) => string;
    disabled?   : boolean;
    description?: string;
}

const Row = (props:RowProps) => {
    const [isFocus, setIsFocus] = useState<boolean>(false);

    return (
        <div className={['flex relative', props.className].join(' ')}>
            <input className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-3 p-2'}
                   placeholder={props.placeholder}
                   name={props.name}
                   onChange={props.setProps}
                   value={props.value[props.name]}
                   disabled={props.disabled}
                   onFocus={() => setIsFocus(true)}
                   onBlur={() => setIsFocus(false)}
            />
            {
                props.check[props.name] !== 'uncheck' &&
                <span className={['flex flex-col justify-center w-5 ms-2', props.inputCheck(props.check[props.name])].join(' ')}
                ><FontAwesomeIcon icon={faCheck}/>
                </span>
            }
            {
                props.description &&
                <span className={['absolute z-10 left-2 -bottom-5 w-50 duration-300 text-xs bg-blue-400 text-white rounded p-2', isFocus ? 'flex items-center' : 'hidden '].join(' ')}>
                    {props.description}
                </span>
            }

        </div>
    )
};

export default Row;


