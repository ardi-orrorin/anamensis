import {BoardBlocking} from "@/app/user/board-block/{services}/types";

export class BoardBlockStatus {

    private readonly status: BoardBlocking.BoardBlockStatus;
    private readonly korName: string;

    public static readonly list: BoardBlockStatus[] = [
        new this(BoardBlocking.BoardBlockStatus.STARTED, '접수'),
        new this(BoardBlocking.BoardBlockStatus.ANSWERED, '답변완료'),
        new this(BoardBlocking.BoardBlockStatus.RESULTED, '처리완료'),
    ];

    constructor(status: BoardBlocking.BoardBlockStatus, korName: string) {
        this.status = status;
        this.korName = korName;
    }

    public getStatus(): string {
        return this.status;
    }

    public getKorName(): string {
        return this.korName;
    }

    public static find(status: string): BoardBlockStatus | undefined {
        return this.list.find((str) =>
            str.getStatus() === status.toUpperCase()
        );
    }
}