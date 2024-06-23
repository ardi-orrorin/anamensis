import {BlockI, BoardContentI} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/board/{components}/block/list";
import {ImageShowProps} from "@/app/board/{components}/block/extra/albumBlock";
import {Dispatch, SetStateAction} from "react";
import {TempFileI} from "@/app/board/{services}/TempFileProvider";

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

export const deleteImage = (props: {
    absolutePath: string,
    setWaitUploadFiles: Dispatch<SetStateAction<TempFileI[]>>,
    setWaitRemoveFiles: Dispatch<SetStateAction<TempFileI[]>>,
}) => {

    const {
        absolutePath, setWaitUploadFiles, setWaitRemoveFiles
    } = props;

    const fileName = absolutePath.substring(absolutePath.lastIndexOf('/') + 1);
    const filePath = absolutePath.substring(0, absolutePath.lastIndexOf('/') + 1);


    setWaitUploadFiles(prevState => {
        return prevState.filter(item => item.fileName !== fileName);
    });

    setWaitRemoveFiles(prevState => {
        return [...prevState, {id: 0, fileName, filePath}];
    });
}