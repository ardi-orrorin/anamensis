interface BoardBlockI {
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
interface BoardBlockHistoriesI {
    id        : number;
    boardPk   : number;
    title     : string;
    status    : BoardBlockStatusEnum;
    createdAt : string;
    answerAt  : string;
    resultAt  : string;
}

enum BoardBlockStatusEnum {
    STARTED  = 'STARTED',
    ANSWERED = 'ANSWERED',
    RESULTED = 'RESULTED',
}

enum BoardBlockResultStatusEnum {
    UNBLOCKING = 'UNBLOCKING',
    BLOCKING   = 'BLOCKING',
}

export namespace BoardBlocking {
    export type BoardBlock               = BoardBlockI;
    export type BoardBlockHistories      = BoardBlockHistoriesI;
    export import BoardBlockStatus       = BoardBlockStatusEnum;
    export import BoardBlockResultStatus = BoardBlockResultStatusEnum;
}