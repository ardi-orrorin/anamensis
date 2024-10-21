import {BlockI} from "@/app/board/{services}/types";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import React from "react";
import {System} from "@/app/user/system/{services}/types";

type DynamicPageT = {
    isEndOfList : boolean;
    isVisible   : boolean;
}

type SearchHistoryPropsT = {
    toggle  : boolean;
    history : string[];
}
interface BoardListT {
    id            : string;
    categoryPk    : string;
    title         : string;
    viewCount     : number;
    rate          : number;
    writer        : string;
    profileImage? : string;
    createdAt     : string;
    commentCount  : number;
    body?         : BlockI[];
    isPublic      : boolean;
    membersOnly   : boolean;
    isBlocked     : boolean;
    roles         : System.Role[];
}

interface BoardListParamsT {
    page          : number;
    size          : number;
    type?         : string;
    value?        : string;
    categoryPk?   : string;
    isSelf        : boolean;
    add           : boolean;
    isFavorite    : boolean;
    [key: string] : string | number | undefined | boolean;
}

type NavItemPropsT = {
    icon           : IconDefinition
    name           : string,
    url            : string
    loginRequired? : boolean,
    prefetch       : boolean
    view           : boolean
    onClick?       : () => void
}

export type NoticeTypeT = {
    id        : number;
    title     : string;
    writer    : string;
    viewCount : number;
    createdAt : string;
}


type SearchBoxPropsT = {
    searchRef          : React.RefObject<HTMLInputElement>;
}

type ScheduleAlertT = {
    id         : number;
    hashId     : string;
    boardTitle : string;
    boardId    : number;
    title      : string;
    alertTime  : string;
    isRead     : boolean;
}

export namespace Root {
    export type DynamicPage          = DynamicPageT;
    export type SearchHistoryProps   = SearchHistoryPropsT;
    export type BoardListI           = BoardListT;
    export type BoardListParamsI     = BoardListParamsT;
    export type NavItemProps         = NavItemPropsT;
    export type NoticeType           = NoticeTypeT;
    export type SearchBoxProps       = SearchBoxPropsT;
    export type ScheduleAlert        = ScheduleAlertT;
}
