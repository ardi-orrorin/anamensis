interface SmtpI {
    host    : string;
    port    : string;
    username: string;
    password: string;
    enabled : boolean;
}

interface HistoryI {
    id       : number;
    to       : string;
    from     : string;
    subject  : string;
    status   : string;
    message  : string;
    createdAt : string;
}

interface HistoriesRowI extends HistoryI {
    rowNum : number;
    index  : number;
}

export namespace SystemSMTP {
    export type Smtp            = SmtpI;
    export type History         = HistoryI;
    export type HistoriesRow    = HistoriesRowI;
}