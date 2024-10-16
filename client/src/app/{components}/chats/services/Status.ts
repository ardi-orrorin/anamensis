export enum StatusEnum {
    ONLINE  = 'ONLINE',
    OFFLINE = 'OFFLINE',
    WORKING = 'WORKING',
    AWAY    = 'AWAY',
    DEFAULT = 'DEFAULT',
}

export class UserStatus {
    readonly value: StatusEnum;
    readonly name: string;
    readonly color: string;

    public static readonly ONLINE  = new this(StatusEnum.ONLINE, '온라인', 'green-500');
    public static readonly OFFLINE = new this(StatusEnum.OFFLINE, '오프라인', 'black');
    public static readonly WORKING = new this(StatusEnum.WORKING, '작업중', 'red-500');
    public static readonly AWAY    = new this(StatusEnum.AWAY, '자리비움', 'yellow-600');
    public static readonly DEFAULT = new this(StatusEnum.DEFAULT, '기본', 'gray-100');

    constructor(value: StatusEnum, name: string, color: string) {
        this.value = value;
        this.name = name;
        this.color = color;
    }

    public static all(): UserStatus[] {
        return [
            this.ONLINE,
            this.OFFLINE,
            this.WORKING,
            this.AWAY,
            this.DEFAULT
        ];
    }

    public static fromString(value: string) {
        return this.all().find((e) => e.value.toLowerCase() === value.toLowerCase())
            ?? this.DEFAULT;
    }

}