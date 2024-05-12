import {ChangeEvent, Dispatch, MutableRefObject, SetStateAction} from "react";

export type BlockProps = {
    seq                : number;
    color?             : string;
    code               : string;
    bg?                : string;
    text?              : string;
    size?              : string;
    isView             : boolean;
    openMenu           : boolean;
    value              : string;
    setValue           : Dispatch<SetStateAction<string>>;
    blockRef           : MutableRefObject<HTMLElement[] | null[]>;
    openMenuToggle?    : ({label, code}: MenuParams) => void;
    onChangeHandler?   : (e: ChangeEvent<HtmlElements>) => void;
    onKeyUpHandler?    : (e: React.KeyboardEvent<HtmlElements>) => void;
    onKeyDownHandler?  : (e: React.KeyboardEvent<HtmlElements>) => void;
    onClickAddHandler? : () => void;
}

export type MenuParams = {
    label: string;
    code: string;
}

export type HtmlElements = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | HTMLDataElement;