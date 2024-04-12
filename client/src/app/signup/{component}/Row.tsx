import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {CheckProps, UserProps} from "@/app/signup/page";

export type RowProps = {
    className?  : string;
    name        : string;
    value       : UserProps;
    check       : CheckProps;
    placeholder : string;
    setProps    : (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputCheck  : (eleId: null | boolean) => string;
}


const Row = (props:RowProps) => {
    return (
        <div className={['flex justify-between', props.className].join(' ')}>
            <input
                className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded my-3 p-2'}
                placeholder={props.placeholder}
                name={props.name}
                onChange={props.setProps}
                value={props.value[props.name]}
            />
            <span className={['flex flex-col justify-center w-5 ms-2', props.inputCheck(props.check[props.name])].join(' ')}
            ><FontAwesomeIcon icon={faCheck}/>
            </span>
        </div>
    )
};

export default Row;


