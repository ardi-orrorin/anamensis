import {BoardBlockStatusEnum} from "@/app/user/board-block/{services}/boardBlockProvider";

export class Types {

    private readonly status: BoardBlockStatusEnum;
    private readonly korName: string;

    public static readonly list: Types[] = [
        new Types(BoardBlockStatusEnum.STARTED, '접수'),
        new Types(BoardBlockStatusEnum.ANSWERED, '답변완료'),
        new Types(BoardBlockStatusEnum.RESULTED, '처리완료'),
    ];

    constructor(status: BoardBlockStatusEnum, korName: string) {
        this.status = status;
        this.korName = korName;
    }

    public getStatus(): string {
        return this.status;
    }

    public getKorName(): string {
        return this.korName;
    }

    public static find(status: string): Types | undefined {
        return this.list.find((str) =>
            str.getStatus() === status.toUpperCase()
        );
    }


}