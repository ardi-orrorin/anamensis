import {BlockI} from "@/app/board/{services}/types";
import {BoardService} from "@/app/board/{services}/BoardProvider";
import {Dispatch, MutableRefObject, SetStateAction} from "react";

export type KeyEventType = {
    seq: number;
    board?: BoardService;
    setBoard?: Dispatch<SetStateAction<BoardService>>;
    blockRef?: MutableRefObject<HTMLElement[] |null[]>;
    event?: React.KeyboardEvent<HTMLElement>;
    addBlock?: (seq: number, init: boolean, value?: string) => BlockI;
    addBlockHandler?: (seq: number, value?: string) => void;
}

const backspace = (args: KeyEventType) => {
    const {
        board, seq, blockRef
        , setBoard, addBlock
        , event
    } = args

    if(seq === 0 || !board || !addBlock || !setBoard || !blockRef || !event) return;

    const list = board.data?.content?.list as BlockI[];
    if (!list) return ;

    const currentBlock = list.find(item => item.seq === seq)!;

    if(seq === 0 && currentBlock.value === '') {
        const newList = list.map((item, index) => {
            if (item.seq !== 0) return item;
            return addBlock(0, true);
        });
        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }


    if(seq === 0) {
        setTimeout(() => {
            blockRef.current[0]?.focus();
        },100);
        return;
    }

    const curRef = blockRef.current[seq] as HTMLInputElement;
    if(curRef.selectionStart !== 0) return;
    event.preventDefault();
    const afterText = curRef.value.substring(curRef.selectionStart!);

    const newList = list
        .map((item, index) => {
            if (item.seq !== 0 && item.seq === seq - 1 && afterText !== '') {
                item.value += afterText;
            }
            return item;
        })
        .filter(item => item.seq !== seq)
        .sort((a, b) => a.seq - b.seq)
        .map((item, index) => {
            item.seq = index;
            return item;
        });

    setBoard({...board, data: {...board.data, content: {list: newList}}});

    setTimeout(() => {
        const prevRef = blockRef.current[seq - 1] as HTMLInputElement;
        const position = prevRef.value.length - afterText.length;
        prevRef.setSelectionRange(position, position);
        prevRef?.focus();
    },50);
}

const arrowUp = (args: KeyEventType) => {
    const {
        seq, blockRef, event
    } = args;

    if(seq === 0 || !blockRef || !event) return;
    event.preventDefault();

    const curRef = event.currentTarget as HTMLInputElement;
    const prevRef = blockRef.current[seq - 1] as HTMLInputElement;
    const prevPosition = curRef.selectionStart! > prevRef.value.length ? prevRef.value.length : curRef.selectionStart;

    prevRef.setSelectionRange(prevPosition, prevPosition);
    prevRef.focus();
}

const arrowDown = (args: any) => {
    const {seq, blockRef, event, board} = args;

    if(seq === board.data.content.list.length - 1) return;
    event.preventDefault();
    blockRef.current[seq + 1]?.focus();
}

const KeyDownEvent = {
    backspace,
    arrowDown,
    arrowUp,
}

export default KeyDownEvent;

