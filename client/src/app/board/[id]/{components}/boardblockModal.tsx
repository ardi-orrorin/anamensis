import React, {useContext, useState} from "react";
import ModalProvider, {ModalI} from "@/app/user/board-block/{services}/modalProvider";
import BoardProvider from "@/app/board/{services}/BoardProvider";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {faCaretRight} from "@fortawesome/free-solid-svg-icons";
import apiCall from "@/app/{commons}/func/api";
import {BoardBlocking} from "@/app/user/board-block/{services}/types";

const BoardBlockModal = () => {

    const {setModal} = useContext(ModalProvider);
    const {board} = useContext(BoardProvider);
    const [reason, setReason] = useState('');

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setReason(e.target.value);
    }

    const onSubmitHandler = async () => {
        const body = {
            boardPk: Number(board.data.id),
            reason,
        } as BoardBlocking.BoardBlock;
        await apiCall<any, BoardBlocking.BoardBlock>({
            path: '/api/user/board-block-history',
            body,
            method: 'POST',
            isReturnData: true,
        })
        .then(res => {
            location.href = '/';
        });
    }

    const onCloseModal = () => {
        setModal({} as ModalI);
    }

    return (
        <div className={'fixed z-[40] top-0 left-0 w-full h-full flex justify-center items-center bg-gray-700 bg-opacity-20'}
        >
            <div className={'w-full md:w-[40%] flex flex-col gap-7 justify-between p-5 bg-white rounded-md shadow-md duration-500'}
                 onClick={e=> e.stopPropagation()}
            >
                <div className={'w-full h-10 flex'}>
                    <div className={'w-[90%] py-2 border-b-2 border-solid border-gray-800 font-bold'}>
                        <span className={'line-clamp-1'}>
                            {board.data.title}
                        </span>
                    </div>
                    <div className={'w-[10%] flex justify-end'}>
                        <button onClick={onCloseModal}>
                            <FontAwesomeIcon icon={faXmark} size={'lg'} />
                        </button>
                    </div>
                </div>
                <div className={'relative w-full flex flex-col gap-3'}>
                    <label className={'text-sm flex gap-2 items-center'}>
                        <FontAwesomeIcon icon={faCaretRight} />
                        제한 이유
                    </label>
                    <textarea className={'w-full border border-gray-300 border-solid rounded p-2 outline-0 text-sm resize-none'}
                              name={'reason'}
                              value={reason}
                              maxLength={500}
                              onChange={onChangeHandler}
                              rows={5}
                              autoFocus={true}
                    />
                    <span className={'absolute right-3 bottom-3'}>
                        {reason.length} / 500
                    </span>
                </div>
                <div className={'w-full flex gap-2 justify-center'}>
                    <button className={'w-[45%] md:w-28 h-12 md:h-8 rounded bg-blue-400 text-white text-sm'}
                            onClick={onSubmitHandler}
                    >
                        게시글 제한
                    </button>
                    <button className={'w-[45%] md:w-20 h-12 md:h-8 rounded bg-red-400 text-white text-sm'}
                            onClick={onCloseModal}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BoardBlockModal;