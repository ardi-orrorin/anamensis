import ModalProvider, {ModalI} from "@/app/system/message/{services}/modalProvider";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import apiCall, {ApiCallProps} from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";
import {System} from "@/app/system/message/{services}/types";

const Message = () => {
    const {modal, setModal} = useContext(ModalProvider);

    const [messageList, setMessageList] = useState<System.SysMessage[]>([]);
    const [message, setMessage] = useState({} as System.SysMessage);
    const [loading, setLoading] = useState({}as System.Loading);
    const [edit, setEdit] = useState(false);
    const [init, setInit] = useState(true);

    const debounce = createDebounce(500);

    useEffect(() => {
        setLoading({
            ...loading,
            listLoading: true
        })
        const fetch = async () => {
            await apiCall({
                path: '/api/config/sys-message/web-sys/' + modal.id,
                method: 'GET',
            })
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
        }

        fetch();

    }, [modal.id, messageList.length]);

    useEffect(() => {
        if(!message.id) return;

        const fetch = async () => {
           await apiCall({
                path: '/api/config/sys-message',
                method: 'GET',
                call: 'Proxy',
                params: {
                    id: message.id
                }
            })
            .then(res => {
                setMessage(res.data);
                setEdit(true);
                setInit(false);
            })
            .catch(err => {
                console.log(err);
            })
        }

        const debounce = createDebounce(500);
        debounce(fetch);

    },[message.id]);

    const modalClose = () => {
        bodyScrollToggle(true);
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
        } as System.SysMessage);
        setInit(true);
        setEdit(false);
    }

    const submitMessageHandler = async (addItem: boolean, remove: boolean) => {

        let config: ApiCallProps = {
            path: '/api/config/sys-message',
            method: 'POST',
        }

        if(remove) {
            config = {
                ...config,
                method: 'DELETE',
                params: {id: message.id}
            }
        } else {
            config = {...config,
                method: addItem ? 'POST' : 'PUT',
                body: addItem ? {...message, webSysPk: modal.id} : message
            }
        }

        const fetch = async () => {
            await apiCall(config)
                .then(res => {
                    setMessageList([]);
                    initMessage();
                })
                .catch(err => {
                    console.log(err);
                })
        }

        debounce(fetch);
    }

    const textareaStyle = `resize-none outline-0 text-sm p-2 rounded h-12 overflow-y-hidden focus:bg-blue-100 focus:h-52 focus:overflow-y-auto duration-500`

    return (
        <div className={'fixed z-30 top-0 left-0 w-full min-h-screen flex justify-center items-center duration-500 bg-gray-600 bg-opacity-50'}
             onClick={modalClose}
        >
            <div className={['absolute z-10 lg:w-2/3 lg:h-[800px] w-full h-screen bg-white flex flex-col gap-4 rounded drop-shadow-2xl p-5 overflow-y-auto duration-500'].join(' ')}
                onClick={stopPropagation}
            >
                <header className={'flex w-full justify-between items-center'}>
                    <span className={'text-xl font-bold'}>
                        시스템 메시지 수정 및 추가
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
                        {
                            Array.from({length: 5}, (_, index) => {
                                const extra = `extra${index+1}`;
                                return (
                                    <div key={extra} className={'flex flex-col gap-2'}>
                                        <span>
                                            추가{index + 1}
                                        </span>
                                        <textarea className={textareaStyle}
                                                  placeholder={'메시지 내용을 입력하세요'}
                                                  name={extra}
                                                  value={message[extra] as string}
                                                  onChange={onChangeHandler}
                                        />
                                    </div>
                                )
                            })
                        }
                        <div className={'flex gap-3 duration-300'}>
                            {
                                init
                                && <button className={'w-full bg-blue-300 hover:bg-blue-600 text-white p-2 rounded duration-300'}
                                        onClick={()=>submitMessageHandler(true, false)}
                                >
                                    등록
                                </button>
                            }
                            {
                                edit
                                && !init
                                && <button className={'w-full bg-blue-300 hover:bg-blue-600 text-white p-2 rounded duration-300'}
                                      onClick={()=>submitMessageHandler(false, false)}
                                >
                                    수정
                                </button>
                            }
                            {
                                edit
                                && !init
                                && <button className={'w-full bg-red-300 hover:bg-red-600 text-white p-2 rounded duration-300'}
                                      onClick={()=>submitMessageHandler(false, true)}
                                >
                                    삭제
                                </button>
                            }
                        </div>
                        {
                            addMessage
                            && <div>
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