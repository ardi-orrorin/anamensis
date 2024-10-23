
interface PointI {
    id       : number;
    name     : string;
    point    : number;
    initValue: number;
    editable : boolean;
}


interface RequestResetI {
    ids: number[];
    all: boolean;
}

export namespace SystemPoint {
    export type Point = PointI;
    export type RequestReset = RequestResetI;
}