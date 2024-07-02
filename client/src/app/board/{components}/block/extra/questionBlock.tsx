import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";
import {useContext, useEffect, useMemo} from "react";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import moment from "moment";

export type QuestionBlockExtraValueType = {
    selectId   : string;
    selectDate : string;
    endDate    : string;
    point      : number;
    state      : 'wait' | 'completed';
}

const QuestionBlock = (props: ExpendBlockProps) => {
    const {
        hash, onChangeExtraValueHandler, type
    }: ExpendBlockProps = props;

    const extraValue = props.extraValue as QuestionBlockExtraValueType;

    useEffect(()=> {
        if(extraValue) return;
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            selectId: '',
            selectDate: '0',
            endDate: moment().add(10,'days').format('YYYY-MM-DD'),
            point: 0,
            state: 'wait'
        } as QuestionBlockExtraValueType);

    },[])

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({...extraValue, [name]: value});
    }


    return (
        <div className={'flex flex-col gap-2'}
             id={`block_${hash}`}
             aria-roledescription={type}
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
} : QuestionBlockExtraValueType & {
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const {board, myPoint, setMyPoint} = useContext(BoardProvider);

    const onChangeDateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(moment(e.target.value).isAfter(moment().add(9, 'days'))) {
            return onChangeHandler(e);
        }

        alert('최소 10일 이후부터 설정 가능합니다.');
    }

    const onChangePointHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const integerRegex = /^[0-9]+$/;
        if(!integerRegex.test(e.target.value)) return ;

        if(parseInt(e.target.value) > myPoint) {
            alert('보유한 포인트보다 높게 설정할 수 없습니다.');
            e.target.value = String(myPoint);
        }
        if(parseInt(e.target.value) < 0) {
            alert('0보다 작을 수 없습니다.');
            e.target.value = '0';
        }
        onChangeHandler(e);
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
                    || board.isView
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
                    || board.isView
                    ? <span className={'flex justify-center items-center font-bold'}>
                        {point}
                    </span>
                    : <input className={'flex justify-center items-center p-2 outline-0'}
                             type={'text'}
                             name={'point'}
                             value={point}
                             max={myPoint}
                             disabled={board?.data?.isWriter}
                             onChange={onChangePointHandler}
                    />
                }
                {
                    !board?.data?.isWriter
                    && !board.isView
                    && <div className={'flex gap-1 justify-center items-center'}>
                        <span>
                          최대 가능한 포인트 :
                        </span>
                        <span className={'font-bold'}>
                          {myPoint}
                        </span>
                    </div>
                }
            </div>
        </div>
    )
}

const QCompleted = ({
    selectId,
    selectDate,
} : QuestionBlockExtraValueType
) => {
    const { comment } = useContext(BoardProvider);

    const selectWriter = comment.find(item => Number(item.id) === Number(selectId));

    return (
        <div className={'flex flex-col gap-1 text-sm'}>
            <div className={'flex'}>
                <label className={'flex items-center border-solid border-l-4 border-gray-600 p-2'}>
                    답변 완료
                </label>
            </div>
            <div className={'flex flex-col gap-1'}>
                <div className={'flex'}>
                    <span className={'flex items-center border-solid border-l-4 border-gray-600 px-2'}>
                        답변자 : &nbsp;
                    </span>
                    <span className={'text-blue-700 font-bold'}>
                        { selectWriter?.writer ? selectWriter.writer : '미정' }
                    </span>
                </div>
                <div className={'flex'}>
                    <span className={'flex items-center border-solid border-l-4 border-gray-600 px-2'}>
                        답변일 : &nbsp;
                    </span>
                    <span className={'text-blue-700 font-bold'}>
                        { moment(selectWriter?.createdAt).format('YYYY년 MM월 DD일') }
                    </span>
                </div>
                <div className={'flex'}>
                    <span className={'flex items-center border-solid border-l-4 border-gray-600 px-2'}>
                        채택일 : &nbsp;
                    </span>
                    <span className={'text-blue-700 font-bold'}>
                        { selectDate === '0' ? '미정' : moment(selectDate).format('YYYY년 MM월 DD일') }
                    </span>
                </div>
                <div className={'flex'}>
                    <span className={'flex items-center border-solid border-l-4 border-gray-600 pl-2'}>
                        답변내용 : &nbsp;
                    </span>
                    <span className={'flex justify-start w-10/12 text-gray-600 line-clamp-1'}>
                        { selectWriter?.content }
                    </span>
                </div>
            </div>
        </div>
    )
}

export default QuestionBlock;