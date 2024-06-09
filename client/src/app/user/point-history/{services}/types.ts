export class Table {
    public readonly tableName: string;
    public readonly useWith: string;

    public static readonly tableArray = [
        new Table("attendance", "출석체크"),
        new Table("board", "게시글 작성"),
        new Table("board_comment", "댓글 작성"),
        new Table("member", "회원가입"),
    ];

    constructor(tableName: string, useWith: string) {
        this.tableName = tableName;
        this.useWith = useWith;
    }

    public static fromString(tableName: string): Table {
        return Table.tableArray.find((e) =>
            e.tableName === tableName
        ) || new Table("", "알수없음");
    }
}