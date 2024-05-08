import ModalProvider, {ModalI} from "@/app/user/{services}/modalProvider";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

export interface SysMessageI {
    id: string;
    webSysPk: string;
    subject: string;
    content: string;
    extra1: string;
    extra2: string;
    extra3: string;
    extra4: string;
    extra5: string;
    isUse: boolean;
}

export type LoadingType = {
    loading: boolean;
    listLoading: boolean;
}

const Message = () => {
    const {modal, setModal} = useContext(ModalProvider);

    const [messageList, setMessageList] = useState<SysMessageI[]>([]);
    const [message, setMessage] = useState<SysMessageI>({} as SysMessageI);
    const [loading, setLoading] = useState<LoadingType>({}as LoadingType);
    const [edit, setEdit] = useState<boolean>(false);
    const [init, setInit] = useState<boolean>(true);

    useEffect(() => {
        setLoading({
            ...loading,
            listLoading: true
        })

        axios.get('/api/user/sys-message/web-sys/' + modal.id)
            .then(res => {
                setMessageList(res.data);
                setLoading({
                    ...loading,
                    listLoading: false
                })
            })
            .catch(err => {
                console.log(err);
            })

    }, [modal.id, messageList.length]);

    useEffect(() => {
        if(!message.id) return;
        axios.get('/api/user/sys-message', {
            params: {
                id: message.id
            }
        })
        .then(res => {
            console.log(res.data)
            setMessage(res.data);
            setEdit(true);
            setInit(false);
        })
        .catch(err => {
            console.log(err);

        })
    },[message.id]);

    const modalClose = () => {
        bodyScrollToggle();
        setModal({} as ModalI);
    }

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    }

    const getMessage = (id: string) => {
        setMessage({
            ...message,
            id: id
        });
    }

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target;
        setMessage({
            ...message,
            [name]: value
        });
    }

    const addMessage = useMemo(() => {
        return message?.id?.length > 0
            || message?.subject?.length > 0
            || message?.content?.length > 0
            || message?.extra1?.length > 0
            || message?.extra2?.length > 0
            || message?.extra3?.length > 0
            || message?.extra4?.length > 0
            || message?.extra5?.length > 0;
    },[message]);

    const initMessage = () => {
        setMessage({
            id: '',
            webSysPk: '',
            subject: '',
            content: '',
            extra1: '',
            extra2: '',
            extra3: '',
            extra4: '',
            extra5: '',
            isUse: false
        } as SysMessageI);
        setInit(true);
        setEdit(false);
    }

    const createMessage = async () => {

        await axios.post('/api/user/sys-message', {...message, webSysPk: modal.id})
            .then(res => {
                setMessageList([]);
                initMessage();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const modifyMessage = async () => {
        await axios.put('/api/user/sys-message', message)
            .then(res => {
                setMessageList([]);
                initMessage();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const deleteMessage = async () => {
        await axios.delete('/api/user/sys-message', {
            params: {
                id: message.id
            }
        })
            .then(res => {
                setMessageList([]);
                initMessage();
            })
            .catch(err => {
                console.log(err);
            })
    }

    const textareaStyle = `resize-none outline-0 text-sm p-2 rounded h-12 overflow-y-hidden focus:bg-blue-100 focus:h-52 focus:overflow-y-auto duration-500`

    return (
        <div className={'absolute z-20 w-full min-h-screen flex justify-center items-center duration-1000'}
             onClick={modalClose}
        >
            <div className={['absolute z-10 lg:w-2/3 lg:h-[800px] w-full h-screen bg-white flex flex-col rounded drop-shadow-2xl p-10 overflow-y-auto duration-500'].join(' ')}
                onClick={stopPropagation}
            >
                <header className={'flex w-full py-3 justify-between items-center'}>
                    <span className={'text-xl font-bold'}>
                        TITLE
                    </span>
                    <button onClick={modalClose}>
                        <FontAwesomeIcon icon={faXmark} height={8} className={'text-xl hover:text-blue-600 duration-300'} />
                    </button>
                </header>
                <section className={'flex flex-col md:flex-row gap-7 md:gap-3 duration-500'}>
                    <article className={'w-full md:w-1/2 flex flex-col gap-5 duration-500'}>
                        <div className={'flex flex-col gap-2'}>
                            <span>
                                제목
                            </span>
                            <input className={'focus:bg-blue-100 outline-0 text-sm p-2 rounded duration-300'}
                                   placeholder={'메시지 제목을 입력하세요'}
                                   name={'subject'}
                                   value={message.subject}
                                   onChange={onChangeHandler}
                            />
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <span>
                                내용
                            </span>
                            <textarea className={textareaStyle}
                                      placeholder={'메시지 내용을 입력하세요'}
                                      name={'content'}
                                      value={message.content}
                                      onChange={onChangeHandler}
                            />
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <span>
                                추가1
                            </span>
                            <textarea className={textareaStyle}
                                      placeholder={'메시지 내용을 입력하세요'}
                                      name={'extra1'}
                                      value={message.extra1}
                                      onChange={onChangeHandler}
                            />
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <span>
                                추가2
                            </span>
                            <textarea className={textareaStyle}
                                      placeholder={'메시지 내용을 입력하세요'}
                                      name={'extra2'}
                                      value={message.extra2}
                                      onChange={onChangeHandler}
                            />
                        </div>
                        <div className={'flex flex-col gap-2'}>
                            <span>
                                추가3
                            </span>
                            <textarea className={textareaStyle}
                                      placeholder={'메시지 내용을 입력하세요'}
                                      name={'extra3'}
                                      value={message.extra3}
                                      onChange={onChangeHandler}

                            />
                        </div>
                        {/*<div className={'flex flex-col gap-2'}>*/}
                        {/*    <span>*/}
                        {/*        추가4*/}
                        {/*    </span>*/}
                        {/*    <textarea className={'outline-0 text-sm p-2 rounded h-12 overflow-y-hidden focus:bg-blue-100 focus:h-52 focus:overflow-y-auto duration-500'}*/}
                        {/*              placeholder={'메시지 내용을 입력하세요'}*/}
                        {/*              name={'extra4'}*/}
                        {/*              value={message.extra4}*/}
                        {/*              onChange={onChangeHandler}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        {/*<div className={'flex flex-col gap-2'}>*/}
                        {/*    <span>*/}
                        {/*        추가5*/}
                        {/*    </span>*/}
                        {/*    <textarea className={'outline-0 text-sm p-2 rounded h-12 overflow-y-hidden focus:bg-blue-100 focus:h-52 focus:overflow-y-auto duration-500'}*/}
                        {/*              placeholder={'메시지 내용을 입력하세요'}*/}
                        {/*              name={'extra5'}*/}
                        {/*              value={message.extra5}*/}
                        {/*              onChange={onChangeHandler}*/}
                        {/*    />*/}
                        {/*</div>*/}
                        <div className={'flex gap-3 duration-300'}>
                            {
                                init &&
                                <button className={'w-full bg-blue-300 hover:bg-blue-600 text-white p-2 rounded duration-300'}
                                        onClick={createMessage}
                                >
                                  등록
                                </button>
                            }
                            {
                                edit && !init &&
                              <button className={'w-full bg-blue-300 hover:bg-blue-600 text-white p-2 rounded duration-300'}
                                      onClick={modifyMessage}
                              >
                                수정
                              </button>
                            }
                            {
                                edit && !init &&
                              <button className={'w-full bg-red-300 hover:bg-red-600 text-white p-2 rounded duration-300'}
                                      onClick={deleteMessage}
                              >
                                삭제
                              </button>
                            }
                        </div>
                        {
                            addMessage &&
                               <div>
                                <button className={'w-full bg-green-300 hover:bg-green-600 text-white p-2 rounded duration-300'}
                                        onClick={initMessage}
                                >
                                  초기화
                                </button>
                               </div>
                        }
                    </article>
                    <aside className={'w-full md:w-1/2 flex flex-col gap-5 duration-500'}>
                        <table className={'w-full'}>
                            <colgroup>
                                <col width={'10%'} />
                                <col width={'90%'} />
                            </colgroup>
                            <thead>
                            <tr className={'border-b border-solid border-gray-300'}>
                                <th className={'py-1'}>#</th>
                                <th>제목</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                !loading.listLoading && messageList.length > 0 &&
                                messageList.map((message, index) => {
                                    return (
                                        <tr key={`message-${message.id}`}
                                            className={'border-b border-solid border-gray-300 hover:bg-blue-200 hover:text-white duration-300'}
                                            onClick={() => getMessage(message.id)}
                                        >
                                            <td className={'p-2'}>
                                                {index + 1}
                                            </td>
                                            <td className={'p-2'}>
                                                {message.subject}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                        {
                            loading.listLoading &&
                            <div className={'w-full h-32 flex justify-center items-center'}>
                                <LoadingSpinner size={30} />
                            </div>
                        }
                    </aside>
                </section>
            </div>
        </div>
    )
}

export default Message;