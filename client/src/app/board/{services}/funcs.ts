export function findElement(ele: HTMLElement) {
    if(ele?.parentElement?.id.includes('block')) return ele.parentElement;
    return findElement(ele.parentElement!);
}