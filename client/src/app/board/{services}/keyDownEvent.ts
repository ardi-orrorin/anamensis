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


const enter = (args: KeyEventType) => {
    const {
        seq, board,
        blockRef, addBlockHandler,
        event,
    } = args;

    if(!board || !addBlockHandler || !blockRef || !event) return;

    event.preventDefault();

    seq === 0 && event?.currentTarget?.getAttribute('name') === 'title' && blockRef.current[0]?.focus();

    const list = board.data?.content?.list;

    if (!list) return ;

    const curRef = event.currentTarget as HTMLInputElement;
    const afterText = curRef?.value?.substring(curRef.selectionStart!);
    const beforeText = curRef?.value?.substring(0, curRef.selectionStart!);

    addBlockHandler(seq, afterText);

    list.map((item, index) => {
        if (item.seq === seq) {
            item.value = beforeText;
        }
        return item;
    });

    setTimeout(() => {
        const nextCur = blockRef?.current[seq + 1] as HTMLInputElement;
        if(!nextCur) return;
        nextCur.focus();
        nextCur.setSelectionRange(0, 0);
    }, 0);
}


const backspace = (args: KeyEventType) => {
    const {
        board, seq, blockRef
        , setBoard, addBlock
        , event
    } = args

    if(seq < 0 || !board || !addBlock || !setBoard || !blockRef || !event) return;

    const list = board.data?.content?.list as BlockI[];
    if (!list) return ;

    const curRef = blockRef.current[seq] as HTMLInputElement;


    const initCondition = seq === 1 && blockRef?.current[seq - 1]?.ariaRoleDescription === 'extra';
    const initSeq =  initCondition ? 1 : 0;

    const initBlockRef = blockRef.current[initSeq] as HTMLInputElement;

    if(seq === initSeq && initBlockRef.value === '') {
        const newList = list.map((item, index) => {
            if (item.seq !== initSeq) return item;
            return addBlock(initSeq, true);
        });
        setBoard({...board, data: {...board.data, content: {list: newList}}});
    }

    if(seq === initSeq) {
        setTimeout(() => {
            blockRef.current[initSeq]?.focus();
        },0);
        return;
    }

    if(curRef.selectionStart !== 0) return;
    if(blockRef?.current[seq - 1]?.ariaRoleDescription === 'extra') return ;

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
    },0);
}

const arrowUp = (args: KeyEventType) => {
    const {
        seq, blockRef, event
    } = args;

    if(seq === 0 || !blockRef || !event) return;
    event.preventDefault();

    const curRef = event.currentTarget as HTMLInputElement;
    const prevRef = blockRef.current[seq - 1]?.ariaRoleDescription === 'object'
        ? seq - 2 >= 0 && blockRef.current[seq - 2] as HTMLInputElement
        : blockRef.current[seq - 1] as HTMLInputElement;

    if(!prevRef) return;

    const prevPosition = curRef.selectionStart! > prevRef.value.length ? prevRef.value.length : curRef.selectionStart;
    prevRef.setSelectionRange(prevPosition, prevPosition);
    prevRef.focus();
}

const arrowDown = (args: any) => {
    const {seq, blockRef, event, board} = args;

    if(seq === board.data.content.list.length - 1) return;
    event.preventDefault();

    const curRef = event.currentTarget as HTMLInputElement;
    const nextRef = blockRef.current[seq + 1]?.ariaRoleDescription === 'object'
        ? seq + 2 < board.data.content.list.length && blockRef.current[seq + 2] as HTMLInputElement
        : blockRef.current[seq + 1] as HTMLInputElement;



    if(!nextRef) return;

    const nextPosition = curRef.selectionStart! > nextRef.value.length ? nextRef.value.length : curRef.selectionStart;
    nextRef.setSelectionRange(nextPosition, nextPosition);
    nextRef.focus();
}

const KeyDownEvent = {
    enter,
    backspace,
    arrowDown,
    arrowUp,
}

export default KeyDownEvent;

