import {createContext, Dispatch, SetStateAction} from "react";
import {System} from "@/app/system/message/{services}/types";

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
    setPointSummary: Dispatch<SetStateAction<PointSummaryI[]>>;
    roles: System.Role[];
    setRoles: Dispatch<SetStateAction<System.Role[]>>;
    profileImg: string;
    setProfileImg: Dispatch<SetStateAction<string>>;
}

const UserProvider = createContext<UserProviderI>({} as UserProviderI);


export default UserProvider;