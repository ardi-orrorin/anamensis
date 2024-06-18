'use client';

import {useEffect, useState} from "react";
import {faPlus} from "@fortawesome/free-solid-svg-icons/faPlus";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Add from "@/app/user/system/{components}/Add";
import Row from "@/app/user/system/{components}/Row";
import apiCall from "@/app/{commons}/func/api";
import {createDebounce} from "@/app/{commons}/func/debounce";

export interface WebSysI {
    code: string;
    name: string;
    description: string;
    permission: string;
    edit: boolean;
}

export default function Page(){

    const [data, setData] = useState<WebSysI[]>([]);
    const [add, setAdd] = useState<boolean>(false);

    useEffect(() => {
        const fetch = async () => {
            await apiCall<WebSysI[]>({
                path: '/api/user/system',
                method: 'GET',
            })
            .then(res => {
                setData(res.data);
            })
            .catch(async (err) => {
                alert(err.response.data);
                location.href = '/user/';
            });
        }

        fetch();
    },[add]);

    const addHandler = () => {
        setAdd(true);
    }

    return (
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
                    <tr className={'bg-blue-300 h-10 text-white'}>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Permission</th>
                        <th>BTN</th>
                    </tr>
                </thead>
                <tbody>
                {
                    data?.length > 0 &&
                    data?.map((item, index) => {
                        return (
                            <Row key={index} props={item} setData={setData} />
                        )
                    })
                }
                {
                    add &&
                    <Add setAdd={setAdd} data={data} />
                }
                </tbody>
            </table>
            {
                !add &&
                <div className={'flex justify-center items-center w-full'}>
                  <button className={'h-10 w-10 bg-blue-300 text-white rounded-full hover:bg-blue-600 duration-500'}
                          onClick={addHandler}
                  >
                    <FontAwesomeIcon icon={faPlus} height={20} className={'h-[20px]'} />
                  </button>
                </div>
            }
        </div>
    )
}

