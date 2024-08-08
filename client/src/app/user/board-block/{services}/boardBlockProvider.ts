import {createContext} from "react";
import {Common} from "@/app/{commons}/types/commons";

export interface BoardBlock {
    id           : number;
    boardPk      : number;
    title        : string;
    status       : BoardBlockStatusEnum;
    reason       : string;
    answer       : string;
    result       : string;
    createdAt    : string;
    answerAt     : string;
    resultAt     : string;
    resultStatus : BoardBlockResultStatusEnum;
}

export interface BoardBlockHistoriesI {
    id        : number;
    boardPk   : number;
    title     : string;
    status    : BoardBlockStatusEnum;
    createdAt : string;
    answerAt  : string;
    resultAt  : string;
}

export enum BoardBlockStatusEnum {
    STARTED  = 'STARTED',
    ANSWERED = 'ANSWERED',
    RESULTED = 'RESULTED',
}

export enum BoardBlockResultStatusEnum {
    UNBLOCKING = 'UNBLOCKING',
    BLOCKING   = 'BLOCKING',
}

export interface BoardBlockProviderI {
    boardBlock: BoardBlock;
    setBoardBlock: React.Dispatch<React.SetStateAction<BoardBlock>>;
    boardBlockHistories: BoardBlockHistoriesI[];
    setBoardBlockHistories: React.Dispatch<React.SetStateAction<BoardBlockHistoriesI[]>>;
    page: Common.PageI;
    setPage: React.Dispatch<React.SetStateAction<Common.PageI>>;
}

const BoardBlockProvider = createContext({} as BoardBlockProviderI);

export default BoardBlockProvider;