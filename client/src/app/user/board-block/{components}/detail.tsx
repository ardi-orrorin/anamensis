import React, {useCallback, useContext, useEffect} from "react";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import BoardBlockProvider, {BoardBlock} from "@/app/user/board-block/{services}/boardBlockProvider";
import ModalProvider, {ModalI} from "@/app/user/board-block/{services}/modalProvider";
import {faArrowDown, faCaretRight} from "@fortawesome/free-solid-svg-icons";

const Detail = () => {

    const { boardBlock, setBoardBlock } = useContext(BoardBlockProvider);
    const { modal, setModal } = useContext(ModalProvider);

    useEffect(()=> {
        bodyScrollToggle(false);
        return () => {
            bodyScrollToggle(true);
        }
    })

    const onCloseHandler = useCallback(() => {
        setModal({} as ModalI);
        setBoardBlock({} as BoardBlock);
    },[]);

    // todo: 내용 수정
    const onSubmitHandler = () => {
        console.log(boardBlock);
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(e.target.value.length > 500) return;
        setBoardBlock({...boardBlock, [e.target.name]: e.target.value});
    }

    return (
        <>
            <div className={'fixed z-[40] top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-20'}
                 onClick={onCloseHandler}
            >
                <div className={'w-[60%] h-[50%] min-h-[600px] flex flex-col  justify-between p-5 bg-white rounded-md shadow-md'}
                     onClick={e=> e.stopPropagation()}
                >
                    <div className={'w-full h-10 flex'}>
                        <label className={'w-[90%] py-2 border-b-2 border-solid border-gray-800 font-bold'}>
                            {boardBlock.title}
                        </label>
                        <div className={'w-[10%] flex justify-end'}>
                            <button onClick={onCloseHandler}>
                                <FontAwesomeIcon icon={faXmark} size={'lg'} />
                            </button>
                        </div>
                    </div>
                    <div className={'w-full h-[70%] min-h-[400px] flex flex-col gap-3 text-sm'}>
                        <label className={'text-sm flex gap-2 items-center'}>
                            <FontAwesomeIcon icon={faCaretRight} />
                            사유 : {boardBlock.reason}
                        </label>
                        <TextBox name={'answer'}
                                 title={'답변 내용'}
                                 text={boardBlock.answer}
                                 date={boardBlock.answerAt}
                                 onChange={onChangeHandler}
                        />
                        {
                            boardBlock.answer !== ''
                            && boardBlock.answerAt !== ''
                            && <TextBox name={'result'}
                                        title={'처리 결과'}
                                        text={boardBlock.answer}
                                        date={boardBlock.answerAt}
                                        onChange={onChangeHandler}
                            />
                        }
                    </div>
                    <div className={'w-full flex gap-2 justify-center'}>
                        <button className={'w-20 h-8 rounded bg-main text-white text-sm'}>
                            저장
                        </button>
                        <button className={'w-20 h-8 rounded bg-red-700 text-white text-sm'}
                                onClick={onCloseHandler}
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

const TextBox = ({
    name, text, date, onChange, title
}:{
    name     : string;
    text     : string;
    date     : string;
    title    : string;
    onChange : (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) => {
    return (
        <div className={'w-full'}>
            {
                text !== ''
                && date !== ''
                ? <span>{text}</span>
                : <div className={'relative w-full flex flex-col gap-1'}>
                    <FontAwesomeIcon icon={faArrowDown} size={'lg'} className={'font-extrabold'} />
                    <label className={'text-sm flex gap-2 items-center'}>
                        <FontAwesomeIcon icon={faCaretRight} />
                        {title}
                    </label>
                    <textarea className={'w-full border border-gray-300 border-solid rounded p-2 outline-0 text-sm resize-none'}
                            name={name}
                            value={text}
                            maxLength={500}
                            onChange={onChange}
                            rows={5}
                    />
                    <span className={'absolute right-3 bottom-3'}>
                        {text.length} / 500
                    </span>
                </div>
            }
        </div>
    )
}

export default Detail;