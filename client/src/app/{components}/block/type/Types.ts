import {ChangeEvent, Dispatch, MutableRefObject, SetStateAction} from "react";

export type BlockProps = {
    seq: number;
    code: string;
    color: string;
    bg : string;
    text: string;
    size: string;
    isView: boolean;
    openMenu: boolean;
    openMenuToggle: () => void;
    onChangeHandler: (e: ChangeEvent<HtmlElements>) => void;
    onKeyUpHandler: (e: React.KeyboardEvent<HtmlElements>) => void;
    onKeyDownHandler: (e: React.KeyboardEvent<HtmlElements>) => void;
    onClickAddHandler: () => void;
    value: string;
    setValue: Dispatch<SetStateAction<string>>;
    blockRef: MutableRefObject<HTMLElement[] | null[]>;
}

export type HtmlElements = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | HTMLDataElement;