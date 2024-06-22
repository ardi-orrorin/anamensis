import {BlockI, BoardContentI} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/board/{components}/block/list";

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

export const notAvailDupCheck = (code: string, content: BoardContentI) : boolean => {
    const findBlock = blockTypeList.find(item => item.code === code);
    if(findBlock?.notAvailDup) {
        const isExist = content?.list.find(item => item.code === code);
        if(isExist) return true
    }
    return false;
}