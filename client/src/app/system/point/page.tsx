'use client';

import SystemContainer from "@/app/system/{components}/systemContainer";
import {useQuery} from "@tanstack/react-query";
import pointApiService from "@/app/system/point/{services}/apiService";
import {SystemPoint} from "@/app/system/point/{services}/types";
import {useEffect, useState} from "react";
import {AxiosError} from "axios";

type LoadingType = {
    index   : number
    status  : boolean
}

export default function Page() {
    const {data: systemPoint, refetch} = useQuery(pointApiService.getPoints());
    
    const [point, setPoint] = useState<SystemPoint.Point[]>([]);

    const [loading, setLoading] = useState({} as LoadingType);

    useEffect(() => {
        if(systemPoint){
            setPoint(systemPoint);
        }
    }, [systemPoint]);

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const {name, value} = e.target;

        setPoint(point => {
            return point.map(item => {
                if(item.id === id){
                    return {
                        ...item,
                        [name]: value
                    }
                }
                return item;
            })
        });
    }

    const onSaveHandler = async (id: number) => {
        const body = id >= 0 ? [
            ...systemPoint?.filter(point => point.id !== id),
            point.find(item => item.id === id)!!
        ] as SystemPoint.Point[] : point;


        setLoading({
            ...loading,
            [id]: true
        });

        try {
            const res = await pointApiService.updatePoints({body});
            // todo: row졀로 변경 완료 됐다는 문구 옆에 표시

        } catch (e) {
            const err = e as AxiosError;
            alert(err.message);
        }
    }

    const onCancelHandler = (id: number) => {
        setPoint(point => {
            return point.map(item => {
                if(item.id === id){
                    return {...systemPoint.find(point => point.id === id)!!};
                }
                return item;
            })
        });
    }


    if(!point) return <>Loading...</>;

    return (
        <div>
            <SystemContainer headline={'시스템 포인트'}>
                <div className={'list-disc'}>
                    <li>
                        <span>시스템 포인트는 시스템에서 사용되는 포인트입니다.</span>
                    </li>
                </div>
                <div className={'flex flex-col gap-4'}>
                    {
                        point.map((point, index) => {
                            return (
                                <Row key={`system-point-${index}`}
                                     {...point}
                                     {...loading}
                                     {...{onChangeHandler, onSaveHandler, onCancelHandler}}
                                />
                            )
                        })
                    }
                </div>
                <div>
                    <button className={'w-20 py-2 bg-blue-600 text-white text-sm rounded shadow'}
                            onClick={() => onSaveHandler(-1)}
                    >
                        모두 저장
                    </button>
                </div>

            </SystemContainer>
        </div>
    );
}

const Row = ({
    id, name, point, editable, index, status,
    onChangeHandler, onSaveHandler, onCancelHandler
}:  {
    onChangeHandler : (e: React.ChangeEvent<HTMLInputElement>, id: number) => void
    onSaveHandler   : (id: number) => void
    onCancelHandler : (id: number) => void
} & SystemPoint.Point & LoadingType) => {

    return (
        <div className={'flex gap-4'}>
            <input className={'px-2 py-1 text-sm w-60 border border-solid border-gray-100 rounded outline-0 focus:bg-gray-100 disabled:bg-gray-200'}
                   name={'name'}
                   value={name}
                   onChange={(e) => onChangeHandler(e, id)}
                   disabled={!editable}
            />
            <input className={'px-2 py-1 text-sm w-60 border border-solid border-gray-100 rounded outline-0 shadow focus:bg-gray-100'}
                   type={'number'}
                   name={'point'}
                   value={point}
                   onChange={(e) => onChangeHandler(e, id)}
            />
            <button className={'w-16 py-1 bg-blue-600 text-white text-sm rounded shadow'}
                    onClick={() => onSaveHandler(id)}
            >수정
            </button>
            <button className={'w-16 py-1 bg-red-600 text-white text-sm rounded shadow'}
                    onClick={() => onCancelHandler(id)}
            >취소
            </button>
        </div>
    )

}