import {CSSProperties} from "react";
import {RoleType} from "@/app/user/system/{services}/types";

export interface BoardI {
    id            : string;
    categoryPk    : number;
    title         : string;
    content       : BoardContentI;
    writer        : string;
    profileImage  : string;
    createdAt     : string;
    updatedAt     : string;
    viewCount     : number;
    rate          : number;
    isLogin?      : boolean;
    isWriter?     : boolean;
    uploadFiles?  : number[];
    removeFiles?  : string[];
    isPublic?     : boolean;
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

export class Category {
    public readonly name: string;
    public readonly id: string;
    public readonly roles: RoleType[];

    public static readonly list = [
        new Category("0", "전체보기", [RoleType.ADMIN, RoleType.USER, RoleType.MASTER, RoleType.GUEST]),
        new Category("1", "공지게시판", [RoleType.ADMIN, RoleType.MASTER]),
        new Category("2", "자유게시판", [RoleType.ADMIN, RoleType.USER, RoleType.MASTER]),
        new Category("3", "Q & A", [RoleType.ADMIN, RoleType.USER, RoleType.MASTER]),
        new Category("4", "알뜰게시판", [RoleType.ADMIN, RoleType.USER, RoleType.MASTER]),
    ];

    constructor(id: string, name: string, roles: RoleType[] = []) {
        this.id    = id;
        this.name  = name;
        this.roles = roles;
    }


    public static findById(id: string): Category | undefined {
        return Category.list.find((e) =>
            e.id === id.toString()
        );
    }

    public static findByName(name: string): Category | undefined {
        return Category.list.find((e) =>
            e.name === name
        );
    }
}