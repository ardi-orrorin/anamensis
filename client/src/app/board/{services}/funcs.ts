import {BlockI, BoardContentI, BoardI, BoardTemplate} from "@/app/board/{services}/types";
import {blockTypeList} from "@/app/board/{components}/block/list";
import {Dispatch, MutableRefObject, SetStateAction} from "react";
import {TempFileI} from "@/app/board/{services}/TempFileProvider";
import {BoardService} from "@/app/board/{services}/BoardProvider";

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

    const block = blockTypeList.find(item => {
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

    const list = board.data?.content?.list;

    const newList = list.map((item, index) => {
        if(code && item.code.slice(0, 3) !== code.slice(0, 3)) {
            item.extraValue = {};
            item.textStyle = {};
        }
        if (item.seq === seq) {
            item.code = block.code;
            item.value = '';
        }
        return item;
    });

    !blockRef?.current[seq + 1]
    && newList.push(addBlock(seq + 1, true, '', true));

    setBoard({...board, data: {...board.data,  content: {list: newList}}});

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