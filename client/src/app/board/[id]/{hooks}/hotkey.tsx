import {useHotkeys} from "react-hotkeys-hook";
import {Options} from "react-hotkeys-hook/src/types";
import {BlockI} from "@/app/board/{services}/types";
import {BoardService} from "@/app/board/{services}/BoardProvider";
import {Dispatch, SetStateAction} from "react";
import {blockTypeFlatList} from "@/app/board/{components}/block/list";
import {BlockService} from "@/app/board/[id]/{hooks}/useBlockEvent";

export const useBoardHotKey = ({
    blockService,
    board,
    setBoard,
    fullScreen,
    setFullScreen,
    blockRef
}:{
    board         : BoardService,
    setBoard      : Dispatch<SetStateAction<BoardService>>,
    blockService  : BlockService,
    fullScreen    : boolean,
    setFullScreen : React.Dispatch<React.SetStateAction<boolean>>,
    blockRef      : React.MutableRefObject<HTMLElement[] | null[]>,
}) => {

    const hotkeyOption: Options = {
        preventDefault: true,
        enableOnFormTags: true,
    };

    useHotkeys('shift+f', ()=> setFullScreen(!fullScreen));

    useHotkeys(['mod+1', 'mod+2', 'mod+3', 'mod+4', 'mod+5', 'mod+6'], (_, handler) => {
        if(blockService?.blockMenu !== 'openTextMenu') return;

        const seq = document.activeElement?.parentElement?.id.split('-')[2];
        if(!seq) return;

        const block = blockTypeFlatList.find(item => item.shortcut === 'mod+' + handler.keys?.join(''));
        if(!block) return;

        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq !== Number(seq)) return item;

            item.code = block.code;
            return item;
        });

        setBoard({...board, data: {...board.data, content: {list: newList}}});

        setTimeout(() => {
            blockRef?.current[Number(seq)]?.focus();
        },100)

    }, hotkeyOption);

    useHotkeys(['mod+b', 'mod+i', 'mod+;', 'mod+/'], (e, handler) => {
        if(blockService?.blockMenu !== 'openTextMenu') return;

        const seq = document.activeElement?.parentElement?.id.split('-')[2];

        const changeValue = ({item, key, value}: {item: BlockI, key: string, value: string}) => {
            if(key === '' || key === '') {
                return item.textStyle = {};
            }
            if(item.textStyle![key] === value) {
                return item.textStyle![key] = '';
            }

            item.textStyle![key] = value;
        }

        const newList = board.data?.content?.list.map((item, index) => {
            if (item.seq !== Number(seq)) return item;

            switch (handler.keys?.join('')) {
                case 'b':
                    changeValue({item, key: 'fontWeight', value: '700'});
                    break;
                case 'i':
                    changeValue({item, key: 'fontStyle', value: 'Italic'});
                    break;
                case ';':
                    changeValue({item, key: 'textDecoration', value: 'line-through'});
                    break;
                case '/':
                    changeValue({item, key: '', value: ''});
                    break;
            }

            return item;
        });

        setBoard({...board, data: {...board.data, content: {list: newList}}});

    }, hotkeyOption);
}