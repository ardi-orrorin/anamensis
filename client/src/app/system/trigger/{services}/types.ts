interface TriggerI {
    [key: string]: SystemTrigger.Item;
}

type ItemType = {
    cron    : string;
    enabled : boolean;
}

interface CronObjI {
    day    : string,
    hour   : string,
    minute : string,
    week   : string[],
    enabled: boolean,
    [key: string]: string | string[] | boolean,
}

export namespace SystemTrigger {
    export type Trigger = TriggerI;
    export type Item = ItemType;
    export type CronObj = CronObjI;
}