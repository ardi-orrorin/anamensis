interface ResponseI {
    status : 'success' | 'error';
    message: string;
}

interface SmtpI {
    host    : string;
    port    : string;
    username: string;
    password: string;
    enabled : boolean;
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

export namespace SystemSMTP {
    export type Response        = ResponseI;
    export type Smtp            = SmtpI;
    export type History         = HistoryI;
    export type HistoriesRow    = HistoriesRowI;
}