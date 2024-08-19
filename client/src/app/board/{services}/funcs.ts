import {BlockI, BoardContentI, BoardI, BoardTemplate} from "@/app/board/{services}/types";
import {blockTypeFlatList} from "@/app/board/{components}/block/list";
import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {BoardService} from "@/app/board/{services}/BoardProvider";
import {TempFileI} from "@/app/board/[id]/{hooks}/usePendingFiles";

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
    const findBlock = blockTypeFlatList.find(item => item.code === code);
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


type BoardUpdateProps = {
    board            : BoardI;
    list?            : BlockI[];
    waitUploadFiles? : TempFileI[];
    waitRemoveFiles? : TempFileI[];
    isTemplate?      : boolean;
}


export function updateBoard(params: BoardUpdateProps & { isTemplate: true }) : BoardTemplate;
export function updateBoard(params: BoardUpdateProps & { isTemplate: false | undefined }) : BoardI;

export function updateBoard(params: BoardUpdateProps) : BoardI | BoardTemplate {
    const {board, list, waitUploadFiles, waitRemoveFiles, isTemplate} = params;
    const {content, isPublic, title,membersOnly} = board;

    if(isTemplate) {
        return {
            name: title,
            content: {
                ...content,
                list: content.list
            },
            isPublic : isPublic ?? false,
            membersOnly : membersOnly ?? false,
        } as BoardTemplate;
    }

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

export const onChangeBlockGlobalHandler = ({
    seq,
    board, setBoard,
    blockRef, isTemplate,
    code, value
} : {
    seq         : number;
    code?       : string;
    value?      : string;
    board       : BoardService;
    setBoard    : Dispatch<SetStateAction<BoardService>>;
    blockRef?   : MutableRefObject<HTMLElement[] | null[]>;
    isTemplate? : boolean;
}) => {
    if(!value && !code) return;

    const block = blockTypeFlatList.find(item => {
        return value ? item.command + ' ' === value
                     : code
                     ? item.code === code
                     : false;
    });

    if(!block) return;

    if(notAvailDupCheck(code || block?.code, board.data?.content)) {
        return alert('중복 사용할 수 없는 블록입니다.');
    }

    if(isTemplate && !block?.onTemplate) return ;

    if(block.notAvailDup) return ;

    const list = [...board.data?.content?.list];

    list.map((item, index) => {
        if(item.seq !== seq) return item;

        if(item.code.slice(0, 3) !== block.code.slice(0, 3)) {
            item.extraValue = {};
            item.textStyle = {};
            item.value = '';
        }

        item.code = block.code;

        return item;
    });

    !blockRef?.current[seq + 1]
    && list.push(addBlock(seq + 1, true, '', true));


    setBoard({...board, data: {...board.data,  content: {list}}});

    setTimeout(() => {
        if(!blockRef?.current) return;
        (block.type === 'object' && block.code === '00191')
            ? blockRef.current[seq + 1]?.focus()
            : blockRef.current[seq]?.focus();
    },0);

    return true;
};

export const addBlock = (seq: number, init: boolean, value?: string, cusSeq?: boolean) => {
    const block: BlockI = initBlock({seq: cusSeq ? seq : 0});
    if(!init) block.seq = seq + 0.1;
    if(value) block.value = value;
    return block;
}