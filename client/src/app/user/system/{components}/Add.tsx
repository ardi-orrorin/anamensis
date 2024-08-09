import {Dispatch, SetStateAction, useState} from "react";
import apiCall from "@/app/{commons}/func/api";
import {System} from "@/app/user/system/{services}/types";

const Add = ({
    setAdd, data
}: {
    setAdd: Dispatch<SetStateAction<boolean>>,
    data: System.WebSys[]
}) => {
    const [webSys, setWebSys] = useState({permission: System.Role.ADMIN} as System.WebSys);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if(e.target.name === 'code') {
            if(data.some(item => item.code === e.target.value.trim())){
                alert('중복된 코드가 존재합니다.');
                return;
            }
            if(e.target.value.trim().length > 4){
                alert('코드는 4자 이하로 입력해주세요.');
                return;
            }
        }

        setWebSys({
            ...webSys,
            [e.target.name]: e.target.value
        });
    }

    const onSaveHandler = async () => {
        await apiCall<System.WebSys>({
            path: '/api/user/system',
            method: 'POST',
            body: webSys,
            call: 'Proxy'
        })
        .then(res => {
            setWebSys({permission: System.Role.ADMIN} as System.WebSys);
            alert('추가 완료');
            setAdd(false);
        })
        .catch(err => {
            console.error(err);
        });
    }

    const onCancelHandler = () => {
        setWebSys({permission: System.Role.ADMIN} as System.WebSys);
    }

    return (
        <tr className={'h-10 '}>
            <td className={'px-2'}>
                <input className={'outline-0 p-2 bg-blue-50 text-blue-700'}
                       name={'code'}
                       value={webSys.code}
                       onChange={onChangeHandler}
                />
            </td>
            <td className={'px-2'}>
                <input className={'outline-0 p-2 bg-blue-50 text-blue-700'}
                       name={'name'}
                       value={webSys.name}
                       onChange={onChangeHandler}
                />
            </td>
            <td className={'px-2'}>
                <input className={'outline-0 p-2 bg-blue-50 text-blue-700'}
                       name={'description'}
                       value={webSys.description}
                       onChange={onChangeHandler}
                />
            </td>
            <td className={'px-2'}>
                <select className={'outline-0 p-2 bg-blue-50 text-blue-700'}
                        name={'permission'}
                        value={webSys.permission}
                        onChange={onChangeHandler}
                >
                    <option value={System.Role.MASTER}>{System.Role.MASTER}</option>
                    <option value={System.Role.ADMIN}>{System.Role.ADMIN}</option>
                    <option value={System.Role.USER}>{System.Role.USER}</option>
                    <option value={System.Role.GUEST}>{System.Role.GUEST}</option>
                </select>
            </td>
            <td className={'px-2'}>
                <div className={'flex items-center gap-3 justify-center'}>
                    <button className={'bg-blue-300 rounded px-4 h-7 text-white hover:bg-blue-600 duration-500'}
                            onClick={onSaveHandler}
                    >Save</button>
                    <button className={'bg-blue-300 rounded px-4 h-7 text-white hover:bg-blue-600 duration-500'}
                            onClick={onCancelHandler}
                    >Cancel</button>
                </div>
            </td>
        </tr>
    )
}

export default Add;