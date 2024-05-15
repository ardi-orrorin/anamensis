import {ChangeEvent, MutableRefObject} from "react";
import {TextStylesType} from "@/app/board/{services}/types";

export type BlockProps = {
    seq                     : number;
    code                    : string;
    textStyle?              : TextStylesType;
    isView?                 : boolean;
    openMenu?               : boolean;
    value                   : string;
    blockRef?                : MutableRefObject<HTMLElement[] | null[]>;
    onChangeHandler?        : (e: ChangeEvent<HtmlElements>) => void;
    onKeyUpHandler?         : (e: React.KeyboardEvent<HtmlElements>) => void;
    onKeyDownHandler?       : (e: React.KeyboardEvent<HtmlElements>) => void;
    onFocusHandler?         : (e: React.FocusEvent<HtmlElements>) => void;
    onMouseEnterHandler?    : (e: React.MouseEvent<HtmlElements>) => void;
    onBlurHandler?          : (e: React.FocusEvent<HtmlElements>) => void;
    onBlurCaptureHandler?   : (e: React.FocusEvent<HtmlElements>) => void;
    onClickAddHandler?      : () => void;
    onClickSubTextMenu?     : (e: React.MouseEvent<HTMLButtonElement>, code: string) => void;
}

export type HtmlElements = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | HTMLDataElement;