import {CSSProperties} from "react";

export interface BoardI {
    id          : string;
    categoryPk  : number;
    title       : string;
    content     : BoardContentI;
    writer      : string;
    profileImage: string;
    createdAt   : string;
    viewCount   : number;
    rate        : number;
}
export interface BoardContentI {
    list          : BlockI[];
    [key: string] : string | number | boolean | BlockI[];
}

export interface BlockI {
    seq         : number;
    value       : string;
    extraValue? : ExtraValueI | string | number | boolean ;
    textStyle?  : TextStylesType;
    code        : string;
}

export interface ExtraValueI {
    [key: string] : string | number | boolean | ExtraValueI;
}

export type TextStylesType = {
    [key: string] : any;
} & CSSProperties

export interface CommentI {
    id            : number;
    blockSeq?     : number;
    writer        : string;
    profileImage  : string;
    content       : string;
    createdAt     : string;
    children?     : CommentI[];
}