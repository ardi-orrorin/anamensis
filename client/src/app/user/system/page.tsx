'use client';

import apiCall from "@/app/{commons}/func/api";
import {preload} from "swr";
import {useState} from "react";
import Row from "@/app/user/system/{components}/Row";
import Add from "@/app/user/system/{components}/Add";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import ModalProvider, {ModalI} from "@/app/user/system/{services}/modalProvider";
import Message from "@/app/user/system/{components}/message";
import {System} from "@/app/user/system/{services}/types";

export default function Page(){

    const [data, setData] = useState<System.WebSys[]>([]);
    const [modal, setModal] = useState({} as ModalI);
    const [add, setAdd] = useState(false);

    const addHandler = () => {
        setAdd(true);
    }

    preload('/api/user/system', async () => {
        return await apiCall<System.WebSys[]>({
            path: `/api/user/system`,
            method: 'GET',
            isReturnData: true,
        });
    })
    .then((res) => {
        setData(res);
    });

    return (
        <ModalProvider.Provider value={{modal, setModal}}>
        <div className={'flex flex-col gap-5'}>
            <table className={'w-full text-sm'}>
                <colgroup>
                    <col width="10%"/>
                    <col width="20%"/>
                    <col width="30%"/>
                    <col width="10%"/>
                    <col width="30%"/>
                </colgroup>
                <thead>
                <tr className={'bg-main h-9 text-white'}>
                    <th className={'border-solid border-x border-white'}>Code</th>
                    <th className={'border-solid border-x border-white'}>Name</th>
                    <th className={'border-solid border-x border-white'}>Description</th>
                    <th className={'border-solid border-x border-white'}>Permission</th>
                    <th className={'border-solid border-x border-white'}>BTN</th>
                </tr>
                </thead>
                <tbody>
                {
                    data?.length > 0 &&
                    data?.map((item, index) => {
                        return (
                            <Row key={index} {...{...item, index, setData}} />
                        )
                    })
                }
                {
                    add
                    && <Add setAdd={setAdd} data={data} />
                }
                </tbody>
            </table>
            {
                !add
                && <div className={'flex justify-center items-center w-full'}>
                    <button className={'h-10 w-10 bg-blue-300 text-white rounded-full hover:bg-blue-600 duration-500'}
                            onClick={addHandler}
                    >
                      <FontAwesomeIcon icon={faPlus} height={20} className={'h-[20px]'} />
                    </button>
                </div>
            }
            {
                modal.isOpen
                && <Message />
            }
        </div>
        </ModalProvider.Provider>
    )
}

