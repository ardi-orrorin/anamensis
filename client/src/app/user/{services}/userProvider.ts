import {createContext, Dispatch, SetStateAction} from "react";

export interface BoardSummaryI {
    id          : number;
    categoryPk  : number;
    title       : string;
    rate        : number;
    viewCount   : number;
    createdAt   : string;
}

export interface AttendInfoI {
    userId   : string;
    email    : string;
    point    : number;
    lastDate : string;
    days     : number;
}

export interface PointSummaryI {
    id: number;
    tableName: string;
    point: number;
    createdAt: string;
}

export interface UserProviderI {
    boardSummary: BoardSummaryI[];
    setBoardSummary: Dispatch<SetStateAction<BoardSummaryI[]>>;
    attendInfo: AttendInfoI;
    setAttendInfo: Dispatch<SetStateAction<AttendInfoI>>;
    pointSummary: PointSummaryI[];
    setPointSummary: Dispatch<SetStateAction<PointSummaryI[]>>
}

const UserProvider = createContext<UserProviderI>({} as UserProviderI);


export default UserProvider;