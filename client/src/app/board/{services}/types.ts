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
    isLogin?    : boolean;
}


export interface BoardContentI {
    list          : BlockI[];
    [key: string] : string | number | boolean | BlockI[];
}

export interface BlockI {
    seq         : number;
    hash        : string;
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
    blockSeq?     : string;
    writer        : string;
    profileImage  : string;
    content       : string;
    createdAt     : string;
    children?     : CommentI[];
    isWriter?     : boolean;
}

export interface DeleteCommentI {
    id?      : number;
    confirm : boolean;
}