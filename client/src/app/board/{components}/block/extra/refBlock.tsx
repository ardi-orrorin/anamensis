import {BlockProps, ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import {useCallback, useMemo, useState} from "react";
import useSWR from "swr";
import apiCall from "@/app/{commons}/func/api";
import {BlockI, RefBoardI} from "@/app/board/{services}/types";
import Link from "next/link";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import moment from "moment";
import ObjectTemplate from "@/app/board/{components}/block/ObjectTemplate";
import {BlockComponentType, blockTypeFlatList} from "@/app/board/{components}/block/list";


export type RefBlockExtraValueType = {
    boardId: string;
    blockId: string;
}

const RefBlock = (props: ExpendBlockProps & {code: string}) => {
    const {
        hash, type,
        isView, code,
        seq, blockRef,
        onChangeExtraValueHandler,
        onChangeValueHandler,
        onKeyUpHandler,
        onKeyDownHandler,
        onMouseEnterHandler,
        onMouseLeaveHandler
    } = props;

    const extraValue = props.extraValue as RefBlockExtraValueType;

    const [value, setValue] = useState<string>('');
    const [valid, setValid] = useState<string>('');
    const [boardValue, setBoardValue] = useState<RefBoardI>({} as RefBoardI);
    const [refBlock, setRefBlock] = useState<BlockI>({} as BlockI);
    const [loading, setLoading] = useState<boolean>(false);

    const {mutate} = useSWR(['/api/board/ref', hash], async () => {
        if(!extraValue?.boardId || extraValue.boardId === '') return;
        setLoading(true);
        return await apiCall<RefBoardI>({
            path: '/api/board/ref/' + extraValue.boardId,
            method: 'GET',
            isReturnData: true
        })
        .then(res => {
            setBoardValue(res);
            const block = res?.content?.list?.length > 0
                && res.content?.list?.find(block => block.hash === extraValue.blockId);

            if(block && block.code === code) {
                alert('참조 블록을 참조 할 수 없습니다.');
                return ;
            }

            const calenderBlock = blockTypeFlatList.find(e =>
                e.label === 'calender') as BlockComponentType;

            if(block && block.code === calenderBlock.code) {
                alert('캘린더 블록은 참조 할 수 없습니다.');
                return ;
            }

            setRefBlock(block as BlockI);
        })
        .catch(e => {
            console.log(e)
        })
        .finally(() => {
            setLoading(false);
        })
    }, {
        revalidateOnFocus: false,
    })

    const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setValid('');
    },[]);

    const onChangeValuesHandler = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        if(value === '') return;
        const regExp = /\/board\/(\d+)#block-(\d){13}-(\d+)/i;

        if(!regExp.test(value)) {
            e.currentTarget.focus();
            setValid('링크 형식이 맞지 않습니다.');
        }

        const boardId = regExp.exec(value)![1];

        const blockId = regExp.exec(value)![0].split('#block-')[1];

        if(!onChangeExtraValueHandler) return ;
        onChangeExtraValueHandler!({
            boardId,
            blockId
        } as RefBlockExtraValueType);

        if(!onChangeValueHandler) return;
        onChangeValueHandler(e.target.value);

        setTimeout(async () => {
            await mutate();
        },100);
    },[value, extraValue]);

    const Component = useMemo(()=> {
        return blockTypeFlatList.find(e => {
            return e.code === refBlock?.code
        })?.component;
    }, [refBlock, boardValue]);


    return (
        <ObjectTemplate {...{hash, seq, type, isView, blockRef, onMouseEnterHandler, onMouseLeaveHandler}}>
            <div className={[
                'flex flex-col w-full items-center gap-4 outline-0 break-all',
                isView || 'p-1',
            ].join(' ')}
                 style={{backgroundColor: isView ? '' : 'rgba(230,230,230,0.2)'}}
            >
                {
                    !isView
                    && <input className={'w-full text-sm px-2 py-1 outline-0 bg-opacity-0 bg-white'}
                              value={value}
                              placeholder={'링크를 입력하세요.'}
                              onChange={onChangeHandler}
                              onBlur={onChangeValuesHandler}
                              onKeyUp={onKeyUpHandler}
                              onKeyDown={onKeyDownHandler}
                              ref={el => {props!.blockRef!.current[props.seq] = el}}
                    />
                }
                {
                    !isView
                    && valid
                    && <span className={'text-sm text-red-600'}>{valid}</span>
                }
                {
                    Number(boardValue?.id) > 0
                    && <div className={'p-3 w-full flex flex-col gap-4 justify-start items-start sm:items-center border border-solid border-red-800 bg-red-400 bg-opacity-5 rounded'}>
                        <div className={'w-full flex flex-col sm:flex-row justify-between items-start gap-1 text-sm'}>
                          <div className={'flex gap-2'}>
                            <label className={'text-red-700 font-bold'}>
                              Reference
                            </label>
                            <Link className={'text-blue-600'}
                                  href={`/board/${extraValue.boardId}#block-${extraValue.blockId}`}
                                  target={'_blank'}
                            >
                              원본 보기
                            </Link>
                          </div>
                          <div className={'hidden sm:flex gap-1 items-center'}>
                            <span className={'pr-2 w-32 line-clamp-1'}>
                                {boardValue.title}
                            </span>
                            <span className={'px-2 border border-solid border-x-2 border-y-0 border-gray-500'}>
                                {boardValue.writer}
                            </span>
                            <span className={'px-2'}>
                                {moment(boardValue.updatedAt).format('YYYY-MM-DD')}
                            </span>
                          </div>
                        </div>
                        {
                            loading
                            ? <LoadingSpinner size={20} />
                            : !boardValue.isPublic && !boardValue.isWriter
                            ? <span className={'text-sm text-red-600'}>
                              비공개 게시글입니다.
                              </span>
                            : boardValue.membersOnly && !boardValue.isLogin
                                ? <span className={'text-sm text-red-600'}>
                                  회원 전용 게시글 입니다.
                                </span>
                                : Component
                                && <Component {...{...refBlock, isView: true} as BlockProps | ExpendBlockProps}/>
                        }
                    </div>
                }
            </div>
        </ObjectTemplate>
    )
}

export default RefBlock;