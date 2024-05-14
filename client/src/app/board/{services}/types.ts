import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {CSSProperties} from "react";

export interface BoardI {
    id          : string;
    categoryPk  : number;
    title       : string;
    content     : BoardContentI;
    writer      : string;
    createdAt   : string;
}
export interface BoardContentI {
    list          : BlockI[];
    [key: string] : string | number | boolean | BlockI[];
}

export interface BlockI {
    seq        : number;
    value      : string;
    textStyle? : TextStylesType;
    code       : string;
}

export type TextStylesType = {
    [key: string] : any;
} & CSSProperties

export type OpenMenuProps = {
    open  : boolean;
    seq   : number;
}

export type SubTextMenuType = {
    icon  : IconDefinition;
    label : string;
    code  : string;
    value : string;
}