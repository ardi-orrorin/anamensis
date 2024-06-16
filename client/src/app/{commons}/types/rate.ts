export class RateColor {
    private readonly color: string;
    private readonly rate: number;

    private static readonly colors = [
        new RateColor({color: "#9ca3af", rate: 0}),
        new RateColor({color: "#4d7c0f", rate: 9}),
        new RateColor({color: "#3b82f6", rate: 29}),
        new RateColor({color: "#eab308", rate: 49}),
        new RateColor({color: "#a21caf", rate: 99}),
        new RateColor({color: "#b91c1c", rate: 999}),
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

