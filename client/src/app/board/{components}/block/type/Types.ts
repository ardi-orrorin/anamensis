import {ChangeEvent, MutableRefObject} from "react";
import {BlockI, ExtraValueI, TextStylesType} from "@/app/board/{services}/types";

export type BlockProps = {
    isView?                      : boolean;
    openMenu?                    : boolean;
    blockRef?                    : MutableRefObject<HTMLElement[] | null[]>;
    onChangeValueHandler?        : (value: string) => void;
    onChangeExtraValueHandler?   : (value: ExtraValueI) => void;
    onChangeHandler?             : (e: ChangeEvent<HtmlElements>) => void;
    onKeyUpHandler?              : (e: React.KeyboardEvent<HtmlElements>) => void;
    onKeyDownHandler?            : (e: React.KeyboardEvent<HtmlElements>) => void;
    onFocusHandler?              : (e: React.FocusEvent<HtmlElements>) => void;
    onMouseEnterHandler?         : (e: React.MouseEvent<MouseEnterHTMLElements>) => void;
    onMouseLeaveHandler?         : (e: React.MouseEvent<HTMLImageElement | HTMLInputElement>) => void;
    onBlurHandler?               : (e: React.FocusEvent<HtmlElements>) => void;
    onBlurCaptureHandler?        : (e: React.FocusEvent<HtmlElements>) => void;
    onClickAddHandler?           : () => void;
    onClickSubTextMenu?          : (e: React.MouseEvent<HTMLButtonElement>, code: string) => void;
    onClickDeleteHandler?        : (seq: number) => void;
} & BlockI;

export type HtmlElements = HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement | HTMLDataElement;
export type MouseEnterHTMLElements = HTMLImageElement | HTMLInputElement | HTMLAnchorElement | HTMLDivElement

