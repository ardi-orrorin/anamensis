export class RateColor {
    private readonly color: string;
    private readonly rate: number;

    private static readonly colors = [
        new RateColor({color: "gray-400", rate: 0}),
        new RateColor({color: "green-700", rate: 9}),
        new RateColor({color: "blue-500", rate: 29}),
        new RateColor({color: "yellow-500", rate: 49}),
        new RateColor({color: "fuchsia-700", rate: 99}),
        new RateColor({color: "red-700", rate: 999}),
    ];

    constructor({color, rate}: {color: string, rate: number}) {
        this.color = color;
        this.rate = rate;
    }

    public static findColor(rate: number): RateColor | undefined {
        return RateColor.colors.find(e => e.rate >= Number(rate));
    }

    get getColor(): string {
        return this.color;
    }

    get getRate(): number {
        return this.rate;
    }
}

