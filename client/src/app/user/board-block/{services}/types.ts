import BoardBlockStatus = BoardBlocking.BoardBlockStatus;
import BoardBlockResultStatus = BoardBlocking.BoardBlockResultStatus;

interface CommonI {
    id           : number;
    boardPk      : number;
    title        : string;
    status       : BoardBlockStatus;
    createdAt    : string;
    answerAt     : string;
    resultAt     : string;
}

interface BoardBlockI extends CommonI {
    reason       : string;
    answer       : string;
    result       : string;
    resultStatus : BoardBlockResultStatus;
}

export namespace BoardBlocking {
    export type BoardBlock           = BoardBlockI;
    export type BoardBlockHistories  = CommonI;


    export enum BoardBlockStatus {
        STARTED  = 'STARTED',
        ANSWERED = 'ANSWERED',
        RESULTED = 'RESULTED',
    }

    export enum BoardBlockResultStatus {
        UNBLOCKING = 'UNBLOCKING',
        BLOCKING   = 'BLOCKING',
    }
}