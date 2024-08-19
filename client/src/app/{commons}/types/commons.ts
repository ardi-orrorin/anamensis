interface PageResponseT<T> {
    page    : Common.PageI;
    content : T[];
}

interface Page {
    page      : number;
    size      : number;
    total     : number;
    criteria  : string;
    order?    : string;
    endPage   : boolean;
    getOffset : number;
}

interface StatusResponseT {
    status    : Common.StatusResponseStatusEnum;
    message   : string;
    timestamp : string;
}

export namespace Common {
    export type PageResponse<T>          = PageResponseT<T>;
    export type PageI                    = Page;
    export type StatusResponse           = StatusResponseT;

    export enum StatusResponseStatusEnum {
        SUCCESS = "SUCCESS",
        FAIL    = "FAIL",
    }
}