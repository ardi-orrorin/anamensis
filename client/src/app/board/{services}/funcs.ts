import {BlockI, BoardContentI, BoardI} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/board/{components}/block/list";
import {Dispatch, SetStateAction} from "react";
import {TempFileI} from "@/app/board/{services}/TempFileProvider";

export function findElement(ele: HTMLElement) {
    if(ele?.parentElement?.id.includes('block')) return ele.parentElement;
    if(ele?.id.includes('block')) return ele;
    return findElement(ele?.parentElement!);
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

export const initBlock = ({
    seq,
    code,
} :{
    seq   : number;
    code? : string;
}) => ({
    seq, value: '', code: code ?? '00005', textStyle: {}, hash: Date.now() + '-' + seq
})

export const updateBoard = ({
    board,
    list,
    waitUploadFiles,
    waitRemoveFiles,
}: {
    board: BoardI;
    list?: BlockI[];
    waitUploadFiles?: TempFileI[];
    waitRemoveFiles?: TempFileI[];
}) : BoardI => {
    const {content, isPublic, title} = board;

    const bodyContent = content.list.filter(item => item.value !== '');

    const textRegex = /^0000\d{1}$/;

    // const searchText = title + ' '
    //     + bodyContent
    //         .filter(item =>
    //             textRegex.test(item.code) || item.code === '00301'
    //         )
    //         .map(item => item.value).join(' ');

    const uploadFiles = waitUploadFiles
        ? waitUploadFiles.map(item => item.id)
        : [];
    const removeFiles = waitRemoveFiles
        ? waitRemoveFiles.map(item => item.filePath + item.fileName)
        : [];

    return {
        ...board,
        content: {
            ...content,
            list: list ?? content.list
        },
        isPublic,
        uploadFiles,
        removeFiles,
        // searchText
    };
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