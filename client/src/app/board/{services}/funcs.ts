import {BlockI} from "@/app/board/{services}/types";

export function findElement(ele: HTMLElement) {
    if(ele?.parentElement?.id.includes('block')) return ele.parentElement;
    return findElement(ele.parentElement!);
}

export const listSort = (list: BlockI[]) => {
    return list.sort((a, b) => a.seq - b.seq)
        .map((item, index) => {
            item.seq = index;
            item.hash = item.hash.split('-')[0] + '-' + index;
            return item;
        });
}