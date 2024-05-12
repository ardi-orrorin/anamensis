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
    seq    : number;
    value  : string;
    bg     : string;
    code   : string;
    color  : string;
    size   : string;
    text   : string;
}

export type OpenMenuProps = {
    open  : boolean;
    seq   : number;
}