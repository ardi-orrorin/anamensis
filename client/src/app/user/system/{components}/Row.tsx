import {Dispatch, SetStateAction, useContext, useState} from "react";
import axios from "axios";
import { WebSysI} from "@/app/user/system/page";
import ModalProvider, {ModalContextType} from "@/app/user/{services}/modalProvider";
import {bodyScrollToggle} from "@/app/user/{services}/modalSetting";
import Message from "@/app/user/system/{components}/message";
import {RoleType} from "@/app/user/system/{services}/types";

const Row = ({
    props, setData
} : {
    props: WebSysI, setData: Dispatch<SetStateAction<WebSysI[]>>
}) => {

    const [webSys, setWebSys] = useState<WebSysI>(props);

    const {modal, setModal} = useContext<ModalContextType>(ModalProvider);

    const onSaveHandler = async () => {
        await axios.put('/api/user/system', webSys)
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
        bodyScrollToggle();
        setModal({
            id: webSys.code,
            route: '메시지',
            isOpen: true,
            params: {},
            component: <Message />
        });
    }

    return (
        <tr className={'h-10 '}>
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
                              onClick={onSaveHandler}
                      >Save</button>
                    }
                    {
                        webSys.edit &&
                      <button className={'bg-blue-300 rounded px-4 h-7 text-white hover:bg-blue-600 duration-500'}
                              onClick={onCancelHandler}
                      >Cancel</button>
                    }
                    {
                        !webSys.edit &&
                      <button className={'bg-blue-300 rounded px-4 h-7 text-white hover:bg-blue-600 duration-500'}
                              onClick={onEditHandler}
                      >Edit</button>
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