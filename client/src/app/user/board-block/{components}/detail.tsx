
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import BoardBlockProvider, {
    BoardBlock,
    BoardBlockResultStatusEnum,
    BoardBlockStatusEnum
} from "@/app/user/board-block/{services}/boardBlockProvider";
import ModalProvider, {ModalI} from "@/app/user/board-block/{services}/modalProvider";
import {faCaretRight} from "@fortawesome/free-solid-svg-icons";
import UserProvider from "@/app/user/{services}/userProvider";
import apiCall from "@/app/{commons}/func/api";
import {RoleType} from "@/app/user/system/{services}/types";
import TextBox from "@/app/user/board-block/{components}/textBox";

const Detail = () => {

    const { boardBlock, setBoardBlock } = useContext(BoardBlockProvider);
    const { setModal } = useContext(ModalProvider);
    const [isTyping, setIsTyping] = useState(false);
    const {roles} = useContext(UserProvider);
    const resultCondition = useMemo(() => {
        return boardBlock.status === BoardBlockStatusEnum.ANSWERED && roles.includes(RoleType.ADMIN)
        || boardBlock.status === BoardBlockStatusEnum.RESULTED && roles.includes(RoleType.USER)
    },[boardBlock.status]);

    useEffect(()=> {
        bodyScrollToggle(false);
        return () => {
            bodyScrollToggle(true);
        }
    })

    const onCloseHandler = useCallback(() => {
        if(isTyping && !confirm('저장하지 않은 내용은 사라집니다. 정말 닫으시겠습니까?')) return;
        setModal({} as ModalI);
        setBoardBlock({} as BoardBlock);
    },[isTyping]);

    const onSubmitHandler = async (status?: BoardBlockResultStatusEnum) => {

        const body = {...boardBlock, resultStatus: status ?? BoardBlockResultStatusEnum.BLOCKING } as BoardBlock

        await apiCall<any, BoardBlock>({
            path: '/api/user/board-block-history/',
            method: 'PUT',
            body,
            isReturnData: true,
        })
        .then(res => {
            setBoardBlock({} as BoardBlock);
            setModal({} as ModalI);
        });
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        !isTyping && setIsTyping(true);
        if(e.target.value.length > 500) return;
        setBoardBlock({...boardBlock, [e.target.name]: e.target.value});
    }

    return (
        <div className={'fixed z-[40] top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-20'}
             onClick={onCloseHandler}
        >
            <div className={'w-full md:w-[60%] h-full md:h-[50%] min-h-[600px] flex flex-col justify-between p-5 bg-white rounded-md shadow-md duration-500'}
                 onClick={e=> e.stopPropagation()}
            >
                <div className={'w-full h-10 flex'}>
                    <div className={'w-[95%] py-2 border-b-2 border-solid border-gray-800 font-bold'}>
                        <span className={'line-clamp-1'}>
                            {boardBlock.title}
                        </span>
                    </div>
                    <div className={'w-[10%] flex justify-end'}>
                        <button onClick={onCloseHandler}>
                            <FontAwesomeIcon icon={faXmark} size={'lg'} />
                        </button>
                    </div>
                </div>
                <div className={'w-full h-[80%] min-h-[400px] py-2 flex flex-col gap-1 text-sm overflow-x-auto'}>
                    <div>
                        <label className={'text-sm flex gap-2 items-center'}>
                            <FontAwesomeIcon icon={faCaretRight} />
                            제한일자 : {boardBlock.createdAt}
                        </label>
                        <span>
                            내용 : {boardBlock.reason}
                        </span>
                    </div>

                    <TextBox name={'answer'}
                             title={'답변 내용'}
                             status={boardBlock.status}
                             text={boardBlock.answer}
                             date={boardBlock.answerAt}
                             onChange={onChangeHandler}
                    />
                    {
                        boardBlock.status === BoardBlockStatusEnum.ANSWERED
                        && roles.includes(RoleType.USER)
                        && !roles.includes(RoleType.ADMIN)
                        && <div className={'w-full flex gap-2'}>
                            <label className={'text-sm flex gap-2 items-center'}>
                                <FontAwesomeIcon icon={faCaretRight} />
                                최종 답변 대기중
                            </label>
                        </div>
                    }
                    {
                        resultCondition
                        && <TextBox name={'result'}
                                    title={'처리 결과'}
                                    status={boardBlock.status}
                                    text={boardBlock.result}
                                    date={boardBlock.resultAt}
                                    onChange={onChangeHandler}
                        />
                    }
                    {
                        boardBlock.status === BoardBlockStatusEnum.RESULTED
                        && (roles.includes(RoleType.USER) || roles.includes(RoleType.ADMIN))
                        && <div className={'w-full flex gap-2'}>
                            <label className={'text-sm flex gap-2 items-center'}>
                                <FontAwesomeIcon icon={faCaretRight}/>
                                처리 결과 : {boardBlock.resultStatus === BoardBlockResultStatusEnum.BLOCKING ? '게시글 제한' : '제한 해제'}
                            </label>
                        </div>
                    }
                </div>
                <div className={'w-full flex gap-2 justify-center'}>
                    {
                        roles.includes(RoleType.ADMIN)
                        && boardBlock.status === BoardBlockStatusEnum.ANSWERED
                            ? <Btn btnText1={'제한 해제'}
                                   onClick1={()=> onSubmitHandler(BoardBlockResultStatusEnum.UNBLOCKING)}
                                   btnText2={'거부'}
                                   onClick2={onSubmitHandler}
                            />
                            : boardBlock.status === BoardBlockStatusEnum.RESULTED
                            ? <Btn btnText1={'닫기'}
                                   onClick1={onCloseHandler}
                            />
                            : <Btn btnText1={'확인'}
                                   onClick1={onSubmitHandler}
                                   btnText2={'취소'}
                                   onClick2={onCloseHandler}
                            />
                    }
                </div>
            </div>
        </div>
    )
}


const Btn = ({
    btnText1,
    btnText2,
    onClick1,
    onClick2
}:{
    btnText1  : string;
    btnText2? : string;
    onClick1  : (status?: BoardBlockResultStatusEnum) => void;
    onClick2? : (status?: BoardBlockResultStatusEnum) => void;
}) => {
    return (
        <>
            <button className={'w-[45%] md:w-20 h-12 md:h-8 rounded bg-main text-white text-sm'}
                    onClick={() => onClick1()}
            >
                { btnText1 }
            </button>
            {
                btnText2 && onClick2 &&
                <button className={'w-[45%] md:w-20 h-12 md:h-8 rounded bg-red-500 text-white text-sm'}
                        onClick={() => onClick2()}
                >
                    { btnText2 }
                </button>
            }
        </>
    )
}

export default Detail;