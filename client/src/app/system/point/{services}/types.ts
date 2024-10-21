
export interface PointI {
    id       : number;
    name     : string;
    point    : number;
    editable : boolean;
}

export namespace SystemPoint {
    export type Point = PointI;

}