
interface SmtpI {
    host: string;
    port: string;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
}

interface PropsI extends SmtpI {
    id?: number;
    options: string[];
}

interface FullPropsI extends SmtpI {
    useSSL: boolean;
    isDefault: boolean;
}
interface TestResponseI {
    result: boolean;
    message: string;
}

interface CardPropsI extends FullPropsI{
    id: number;
    isUse: boolean;
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
    export type Smtp = SmtpI;
    export type Props = PropsI;
    export type FullProps = FullPropsI;
    export type TestResponse = TestResponseI;
    export type CardProps = CardPropsI;
    export type History = HistoryI;
    export type HistoriesRow = HistoriesRowI;
}