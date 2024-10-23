interface RedisI {
    enabled : boolean;
    host    : string;
    port    : number;
}

export namespace SystemCache {
    export type Redis = RedisI;
}
