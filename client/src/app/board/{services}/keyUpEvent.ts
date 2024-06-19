import {KeyEventType} from "@/app/board/{services}/keyDownEvent";

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
    },50);
}


const KeyUpEvent = {
    enter,
};

export default KeyUpEvent;