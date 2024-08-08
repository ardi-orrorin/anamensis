import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import React, {useState} from "react";
import {SignUp} from "@/app/signup/{services}/types";

const Row = (props: SignUp.RowProps) => {
    const {
        type, placeholder,
        name, value,
        disabled, description,
        inputCheck, check,
        setProps, autoFocus
    }: SignUp.RowProps = props

    const [isFocus, setIsFocus] = useState(false);

    return (
        <div className={['flex relative', props.className].join(' ')}>
            <input className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-3 p-2'}
                   type={type ?? 'text'}
                   placeholder={placeholder}
                   name={name}
                   onChange={setProps}
                   value={value[props.name]}
                   disabled={disabled}
                   onFocus={() => setIsFocus(true)}
                   onBlur={() => setIsFocus(false)}
                   autoFocus={autoFocus}
            />
            {
                check[name] !== 'uncheck'
                && <span className={['flex flex-col justify-center w-5 ms-2', inputCheck(check[name])].join(' ')}
                ><FontAwesomeIcon icon={faCheck}/>
                </span>
            }
            {
                description
                && <span className={['absolute z-10 left-2 -bottom-5 w-50 duration-300 text-xs bg-blue-400 text-white rounded p-2', isFocus ? 'flex items-center' : 'hidden '].join(' ')}>
                    {description}
                </span>
            }
        </div>
    )
};

export default React.memo(Row,(prev, next) => {
    return prev.value    === next.value
        && prev.check    === next.check
        && prev.disabled === next.disabled;
});


