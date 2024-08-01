import {Dispatch, SetStateAction, useContext, useState} from "react";
import axios from "axios";
import { WebSysI} from "@/app/user/system/page";
import ModalProvider, {ModalContextType} from "@/app/user/{services}/modalProvider";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import Message from "@/app/user/system/{components}/message";
import {RoleType} from "@/app/user/system/{services}/types";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";

const Row = (props : WebSysI & {
    setData : Dispatch<SetStateAction<WebSysI[]>>;
    index  : number;
}) => {
    const {setData, index} = props;

    const [webSys, setWebSys] = useState<WebSysI>(props);

    const {modal, setModal} = useContext<ModalContextType>(ModalProvider);

    const debounce = createDebounce(500);

    const onSaveHandler = async () => {
        await apiCall<WebSysI>({
            path: '/api/user/system',
            method: 'PUT',
            body: webSys,
        })
        .then(res => {
            setWebSys({
                ...webSys,
                edit: false
            });

            setData(data => {
                return data.map(item => {
                    if(item.code === webSys.code){
                        return webSys;
                    }
                    return item;
                });
            });

            alert('수정 완료');
        })
        .catch(err => {
            console.error(err);
        });
    }

    const onEditHandler = () => {
        setWebSys({
            ...webSys,
            edit: true
        });
    }

    const onCancelHandler = () => {
        setWebSys(props);
    }

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setWebSys({
            ...webSys,
            [e.target.name]: e.target.value
        });
    }

    const onMessageHandler = () => {
        bodyScrollToggle(true);
        setModal({
            id: webSys.code,
            route: '메시지',
            isOpen: true,
            params: {},
            component: <Message />
        });
    }

    const onDeleteHandler = async (code: string) => {

        await apiCall({
            path: '/api/user/system/' + code,
            method: 'DELETE',
        })
        .then(res => {
            setData(data => {
                return data.filter(item => item.code !== code);
            });
            alert('삭제 완료');
        });
    }

    return (
        <tr className={[
            'h-10 border-b border-gray-200 border-solid',
            index % 2 === 1 ? 'bg-blue-50': '',
        ].join(' ')}>
            <td className={'px-2'}>
                <span> {webSys.code} </span>
            </td>
            <td className={'px-2'}>
                {
                    webSys.edit
                    ? <input className={'outline-0 p-2 bg-blue-50 text-blue-700'}
                             name={'name'}
                             value={webSys.name}
                             onChange={onChangeHandler}
                    />
                    :<span> {props.name} </span>
                }
            </td>
            <td className={'px-2'}>
                {
                    webSys.edit
                    ? <input className={'outline-0 p-2 bg-blue-50 text-blue-700'}
                             name={'description'}
                             value={webSys.description}
                             onChange={onChangeHandler}
                    />
                    :<span> {webSys.description} </span>
                }
            </td>
            <td className={'px-2'}>
                {
                    webSys.edit
                    ? <select className={'outline-0 p-2 bg-blue-50 text-blue-700'}
                              name={'permission'}
                              value={webSys.permission}
                              onChange={onChangeHandler}
                    >
                        <option value={RoleType.ADMIN}>{RoleType.ADMIN}</option>
                        <option value={RoleType.USER}>{RoleType.USER}</option>
                        <option value={RoleType.MASTER}>{RoleType.MASTER}</option>
                        <option value={RoleType.GUEST}>{RoleType.GUEST}</option>
                    </select>
                    :<span> {props.permission} </span>
                }
            </td>
            <td className={'px-2'}>
                <div className={'flex items-center gap-3 justify-center'}>
                    {
                        webSys.edit &&
                        <button className={'bg-blue-300 rounded px-4 h-7 text-white hover:bg-blue-600 duration-500'}
                                onClick={()=>debounce(onSaveHandler)}
                        >저장</button>
                    }
                    {
                        webSys.edit &&
                        <button className={'bg-amber-300 rounded px-4 h-7 text-white hover:bg-amber-600 duration-500'}
                                onClick={onCancelHandler}
                        >취소</button>
                    }
                    {
                        webSys.edit &&
                        <button className={'bg-red-300 rounded px-4 h-7 text-white hover:bg-red-600 duration-500'}
                                onClick={()=>debounce(()=>onDeleteHandler(webSys.code))}
                        >삭제</button>
                    }
                    {
                        !webSys.edit &&
                        <button className={'bg-blue-300 rounded px-4 h-7 text-white hover:bg-blue-600 duration-500'}
                                onClick={onEditHandler}
                        >수정</button>
                    }
                    {
                        !webSys.edit &&
                        <button className={'bg-green-300 rounded px-4 h-7 text-white hover:bg-green-600 duration-500'}
                                onClick={onMessageHandler}
                        >메시지</button>
                    }
                </div>
            </td>
        </tr>
    )
}

export default Row;