import {BlockProps} from "@/app/board/{components}/block/type/Types";
import {useContext, useEffect} from "react";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import moment from "moment";

export type QuestionBlockExtraValueType = {
    selectId   : number;
    selectDate : string;
    endDate    : string;
    point      : number;
    state      : 'wait' | 'completed';
}

const QuestionBlock = (props: BlockProps) => {
    const {
        hash, value
        , onChangeExtraValueHandler
        , isView,
    }: BlockProps = props;
    const {board} = useContext(BoardProvider);

    const extraValue = props.extraValue as QuestionBlockExtraValueType;

    useEffect(()=> {
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            selectId: 0,
            selectDate: '0',
            endDate: moment().add(10,'days').format('YYYY-MM-DD'),
            point: 0,
            state: 'wait'
        } as QuestionBlockExtraValueType);

    },[])


    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        // if(!extraValue) return;
        const {name, value} = e.target;

        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({...extraValue, [name]: value});
    }


    return (
        <div className={'flex flex-col gap-2'}
             id={`block_${hash}`}
             aria-roledescription={'extra'}
             ref={el => {props!.blockRef!.current[props.seq] = el}}
        >
            {
                extraValue?.state === 'wait'
                ? <QWait {...{...extraValue, onChangeHandler}} />
                : <QCompleted {...{...extraValue, onChangeHandler}}/>
            }
        </div>
    );
}

const QWait = ({
    endDate,
    point,
    onChangeHandler,
} : QuestionBlockExtraValueType
& {
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const {board} = useContext(BoardProvider);

    const onChangeDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(moment(e.target.value).isAfter(moment().add(9, 'days'))) {
            return onChangeHandler(e);
        }

        alert('최소 10일 이후부터 설정 가능합니다.');
    }

    const onChangePointHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(Number(e.target.value) > 0) {
            onChangeHandler(e);
        }
        e.target.value = '0';
    }

    return (
        <div className={'flex flex-col gap-1 text-sm'}>
            <div className={'flex'}>
                <span className={'flex items-center border-solid border-l-4 border-gray-600 px-2'}>
                    {board?.data?.isWriter ? '질문 정보' : '질문 옵션 설정 중'}
                </span>
            </div>
            <div className={'flex'}>
                <span className={'flex items-center border-solid border-l-4 border-gray-600 px-2'}>
                    마감일 : &nbsp;
                </span>
                {
                    board?.data?.isWriter
                    ? <span className={'flex justify-center items-center font-bold'}>
                        {moment(endDate).format('YYYY년 MM월 DD일')}
                    </span>
                    : <input className={'flex justify-center items-center h-8 p-2 outline-0'}
                             type={'date'}
                             name={'endDate'}
                             value={endDate}
                             disabled={board?.data?.isWriter}
                             onChange={onChangeDateHandler}
                    />
                }
            </div>
            <div className={'flex'}>
                <span className={'flex justify-center items-center border-solid border-l-4 border-gray-600 px-2'}>
                    포인트 : &nbsp;
                </span>
                {
                    board?.data?.isWriter
                    ? <span className={'flex justify-center items-center font-bold'}>
                        {point}
                    </span>
                    : <input className={'flex justify-center items-center p-2 outline-0'}
                             type={'number'}
                             name={'point'}
                             value={point}
                             disabled={board?.data?.isWriter}
                             onChange={onChangePointHandler}
                    />
                }
            </div>
        </div>
    )
}

const QCompleted = ({
    selectId,
    selectDate,
    endDate,
    state,
} : QuestionBlockExtraValueType
) => {
    return (
        <div className={'flex flex-col gap-1 text-sm'}>
            <div>
                <label>질문 중</label>
            </div>
            <div>
                <div>
                    <span>
                        답변자 : &nbsp;
                    </span>
                    <span>
                        홍길동
                    </span>
                </div>
                <div>
                    <span>
                        답변일 : &nbsp;
                    </span>
                    <span>
                        2021-07-15
                    </span>
                </div>
                <div>
                    <span>
                        채택일 : &nbsp;
                    </span>
                    <span>
                        2021-07-15
                    </span>
                </div>
            </div>
        </div>
    )
}

export default QuestionBlock;