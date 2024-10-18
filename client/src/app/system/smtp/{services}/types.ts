
interface SmtpI {
    host: string;
    port: string;
    username: string;
    password: string;
}

interface TestResponseI {
    result: boolean;
    message: string;
}

interface HistoryI {
    id       : number;
    subject  : string;
    status   : string;
    message  : string;
    createAt : string;
}

interface HistoriesRowI extends HistoryI {
    rowNum : number;
    index  : number;
}

export namespace SMTP {
    export type Smtp            = SmtpI;
    export type TestResponse    = TestResponseI;
    export type History         = HistoryI;
    export type HistoriesRow    = HistoriesRowI;
}