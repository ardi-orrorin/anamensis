import {InputBase} from "@/app/{components}/block/input/Input-base";
import {BlockProps} from "@/app/{components}/block/type/Types";


// export class InputStyle {
//     private static readonly H1 = {code: '00001', component: InputH1};
//     private static readonly H2 = {code: '00002', component: InputH2};
//     private static readonly H3 = {code: '00003', component: InputH3};
//     private static readonly H4 = {code: '00004', component: InputH4};
//     private static readonly H5 = {code: '00005', component: InputH5};
//
//     static getComponent(code: string) {
//         return this.field().find((item: any) =>
//             item.code === code
//         )?.component;
//     }
//
//     private static field(){
//         return [...Object.values(this)]
//     }
// }

export class InputH1 extends InputBase {
    constructor(props: any) {
        const data: any = {
            ...props,
            fontSize: '2.4rem',
            color: props.color,
            backgroundColor: props.bg,
            fontWeight: '700',
            padding: '0.5rem 0.8rem',
            letterSpacing: '0.03rem',
        }
        super(data);
    }
}

export class InputH2 extends InputBase {
    constructor(props: any) {
        const data: any = {
            ...props,
            fontSize: '1.8rem',
            color: props.color,
            backgroundColor: props.bg,
            fontWeight: '600',
            padding: '0.5rem 0.6rem',
            letterSpacing: '0.03rem',
        }
        super(data);
    }
}

export class InputH3 extends InputBase {
    constructor(props: any) {
        const data: any = {
            ...props,
            fontSize: '1.4rem',
            color: props.color,
            backgroundColor: props.bg,
            fontWeight: '500',
            padding: '0.5rem 0.5rem',
            letterSpacing: '0.03rem',
        }
        super(data);
    }
}

export class InputH4 extends InputBase {
    constructor(props: any) {
        const data: any = {
            ...props,
            fontSize: '1.2rem',
            color: props.color,
            backgroundColor: props.bg,
            padding: '0.5rem 0.4rem',
            letterSpacing: '0.03rem',
        }
        super(data);
    }
}


export class InputH5 extends InputBase {
    constructor(props: any) {
        const data: any = {
            ...props,
            fontSize: '1rem',
            color: props.color,
            backgroundColor: props.bg,
            padding: '0.5rem 0.3rem',
            letterSpacing: '0.03rem',
        }
        super(data);
    }
}


