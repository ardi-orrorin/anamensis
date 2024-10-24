'use client';

import SystemContainer from "@/app/system/{components}/systemContainer";
import {useQuery} from "@tanstack/react-query";
import pointApiService from "@/app/system/point/{services}/apiService";
import {SystemPoint} from "@/app/system/point/{services}/types";
import {useEffect, useMemo, useState} from "react";
import {AxiosError} from "axios";
import {Common} from "@/app/{commons}/types/commons";
import StatusResponse = Common.StatusResponse;
import StatusResponseStatusEnum = Common.StatusResponseStatusEnum;
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

type LoadingType = {
    index   : number
    status  : boolean
}

type ResultType = {
    index   : number;
    status  : StatusResponse;
}

export default function Page() {
    const {data: systemPoint, refetch} = useQuery(pointApiService.getPoints());
    
    const [point, setPoint] = useState<SystemPoint.Point[]>([]);

    const [loading, setLoading] = useState({} as LoadingType);

    const [result, setResult] = useState({} as ResultType);

    useEffect(() => {
        setPoint(systemPoint);
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

        if(id !== -1) {
            const evalPoint = point.find(item => item.id === id)!!.point
                === systemPoint.find(point => point.id === id)!!.point;

            if(evalPoint) return;
        }

        setLoading({index: id, status: true});

        try {
            const res = await pointApiService.updatePoints({body});

            res.status === StatusResponseStatusEnum.SUCCESS && refetch();

            setResult({index: id, status: res});


        } catch (e) {
            const err = e as AxiosError;
            alert(err.message);
        } finally {
            setLoading({} as LoadingType);
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

    const onResetHandler = async (id: number) => {
        const body: SystemPoint.RequestReset = id === -1
            ? {ids: [0], all: true}
            : {ids: [id], all: false};


        setLoading({index: id, status: true});

        try {
            const res = await pointApiService.resetPoints({body});

            res.status === StatusResponseStatusEnum.SUCCESS && refetch();

            setResult({index: id, status: res});
        } catch (e) {
            const err = e as AxiosError;
            alert(err.message);
        } finally {
            setLoading({} as LoadingType);
        }
    }

    if(!point) return <>Loading...</>;

    return (
        <div className={''}>
            <SystemContainer headline={'시스템 포인트'}>
                <div className={'list-disc text-sm'}>
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
                                     {...{loading, result, onChangeHandler, onSaveHandler, onCancelHandler, onResetHandler}}
                                />
                            )
                        })
                    }
                </div>
                <div className={`space-x-2.5`}>
                    <button className={'w-20 py-2 bg-blue-600 text-white text-sm rounded drop-shadow disabled:bg-gray-500'}
                            onClick={() => onSaveHandler(-1)}
                    >
                        {
                            loading.index === -1 && loading.status
                                ? <LoadingSpinner size={10}/>
                                : '모두 저장'
                        }
                    </button>
                    <button className={'w-24 py-2 bg-gray-700 text-white text-sm rounded drop-shadow disabled:bg-gray-500'}
                            onClick={() => onResetHandler(-1)}
                    >
                        {
                            loading.index === -1 && loading.status
                                ? <LoadingSpinner size={10}/>
                                : '모두 초기화'
                        }
                    </button>
                    {
                        result?.index === -1
                        && <span
                        className={`text-sm ${result.status.status === StatusResponseStatusEnum.SUCCESS ? 'text-blue-500' : 'text-red-600'}`}>
                            {result.status.status === StatusResponseStatusEnum.SUCCESS ? '저장 완료' : '저장 실패'}
                        </span>
                    }
                </div>

            </SystemContainer>
        </div>
    );
}

const Row = ({
    id, name, point, initValue, editable, loading, result,
    onChangeHandler, onSaveHandler,
    onCancelHandler, onResetHandler
}: {
    loading: LoadingType
    result: ResultType
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void
    onSaveHandler: (id: number) => void
    onCancelHandler: (id: number) => void
    onResetHandler  : (id: number) => void
} & SystemPoint.Point) => {

    const {data: systemPoint} = useQuery(pointApiService.getPoints());
    const isLoading = useMemo(() => (loading.index === id || loading.index === -1) && loading.status, [loading, id]);

    const currentPoint = useMemo(() => systemPoint?.find(points => points.id === id)  , [id, systemPoint]);

    return (
        <div className={'flex items-center gap-4'}>
            <div className={'relative h-[30px]'}>
                <input
                    className={'px-2 py-1 text-sm w-60 border border-solid border-gray-100 rounded outline-0 drop-shadow focus:bg-gray-100 disabled:bg-gray-100'}
                    name={'name'}
                    value={name}
                    disabled
                />
                <span className={'absolute flex h-full items-center top-0 right-3 text-xs text-gray-500'}
                >
                    초기값 : {initValue}
                </span>
            </div>
            <div className={'relative h-[30px]'}>
                <input
                    className={'px-2 py-1 text-sm w-60 border border-solid border-gray-100 rounded outline-0 drop-shadow focus:bg-gray-100 no-spinner'}
                    type={'number'}
                    name={'point'}
                    value={point}
                    onChange={(e) => onChangeHandler(e, id)}
                />
                <span className={'absolute flex h-full items-center top-0 right-3 text-xs text-gray-500'}
                >
                    현재값: {currentPoint?.point}
                </span>
            </div>
            <button className={'w-16 py-1 bg-blue-600 text-white text-sm rounded drop-shadow disabled:bg-gray-500'}
                    onClick={() => onSaveHandler(id)}
                    disabled={isLoading}
            >
                {
                    isLoading
                        ? <LoadingSpinner size={10}/>
                        : '저장'
                }
            </button>
            <button className={'w-16 py-1 bg-red-600 text-white text-sm rounded drop-shadow disabled:bg-gray-500'}
                    onClick={() => onCancelHandler(id)}
                    disabled={isLoading}
            >
                {
                    isLoading
                        ? <LoadingSpinner size={10}/>
                        : '취소'
                }
            </button>
            <button className={'w-16 py-1 bg-gray-700 text-white text-sm rounded drop-shadow disabled:bg-gray-500'}
                    onClick={() => onResetHandler(id)}
                    disabled={isLoading}
            >
                {
                    isLoading
                        ? <LoadingSpinner size={10}/>
                        : '초기값'
                }
            </button>
            {
                result?.index === id
                && <span
                className={`text-sm ${result.status.status === StatusResponseStatusEnum.SUCCESS ? 'text-blue-500' : 'text-red-600'}`}>
                    {
                        result.status.status === StatusResponseStatusEnum.SUCCESS
                            ? '저장 완료'
                            : '저장 실패'
                    }
                </span>
            }
        </div>
    )

}