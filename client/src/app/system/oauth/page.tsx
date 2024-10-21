'use client';

import SystemContainer from "@/app/system/{components}/systemContainer";
import {useQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";
import SystemToggle from "@/app/system/{components}/SystemToggle";
import {SystemOAuth} from "@/app/system/oauth/{services}/types";
import {useCallback, useEffect, useMemo, useState} from "react";
import {System} from "@/app/system/{services}/types";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import Link from "next/link";

export default function Page() {

    const {data: privateSystemConfig, refetch} = useQuery(systemApiServices.getPrivateSystemConfig());
    const [oauth, setOauth] = useState({} as SystemOAuth.OAuth2);
    const [loading, setLoading] = useState({} as {type: string, value: boolean});

    useEffect(() => {
        setOauth(privateSystemConfig?.oauth);
    }, [privateSystemConfig]);

    const validate = useCallback((type: string) => {
        const defaultConditional = !oauth[type]?.enabled && (!oauth[type]?.clientId || !oauth[type]?.clientSecret);

        if(defaultConditional) {
            alert(`${type}의 clientId와 clientSecret을 입력하세요.`);
            return false;
        }

        if(type === 'custom' && !(oauth[type] as SystemOAuth.CustomOAuth2Item)?.url) {
            alert(`${type}의 clientId, clientSecret, url을 입력하세요.`);
            return false;
        }

        return true;
    }, [oauth]);

    const onClickHandler = useCallback((type: string) => {
        if(!validate(type)) return;

        setOauth(prev => {
            return {
                ...prev,
                [type]: {...prev[type], enabled: !prev[type]?.enabled}
            }
        });
    }, [validate]);


    const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setOauth(prev => {
            return {
                ...prev,
                [type]: {...prev[type], [e.target.name]: e.target.value}
            }
        });
    }, [oauth]);

    const save = useCallback((type: string) => {
        if(!validate(type)) return;

        setLoading({type, value: true});

        const body = {
            key: System.Key.OAUTH,
            value: {...privateSystemConfig?.oauth, [type]: oauth[type]}
        } as System.Request<SystemOAuth.OAuth2>;

        systemApiServices.save({body})
            .then(() => {
                refetch();
            })
            .finally(() => {
                setLoading({type, value: false});
            });
    },[validate, oauth, privateSystemConfig]);

    const init = (type: string) => {
        setLoading({type, value: true});

        const initValue = {
            enabled: false,
            clientId: '',
            clientSecret: '',
            url: type === 'custom' ? '' : undefined
        } as SystemOAuth.OAuth2Item

        const body = {
            key: System.Key.OAUTH,
            value: {...privateSystemConfig?.oauth, [type]: initValue}
        } as System.Request<SystemOAuth.OAuth2>;

        systemApiServices.save({body})
            .then(() => {
                refetch();
            })
            .finally(() => {
                setLoading({type, value: false});
            });

    }

    const list = [
        {type: 'google', headline: 'GOOGLE', description: 'GOOGLE OAuth2', link: 'https://cloud.google.com/apigee/docs/api-platform/security/oauth/oauth-home?hl=ko'},
        {type: 'github', headline: 'GITHUB', description: 'GITHUB OAuth2', link: 'https://docs.github.com/ko/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps'},
        {type: 'kakao', headline: 'KAKAO', description: 'KAKAO OAuth2', link: 'https://developers.kakao.com/product/kakaoLogin'},
        {type: 'naver', headline: 'NAVER', description: 'NAVER OAuth2', link: 'https://developers.naver.com/docs/login/api/api.md'},
        {type: 'custom', headline: 'CUSTOM', description: 'CUSTOM OAuth2', isCustom: true},
    ]

    return (
        <div className={'flex flex-col gap-3'}>
            {
                list.map((item, index) => {
                    return (
                        <Item key={'oauth' + index}
                              {...{
                                  headLine: item.headline,
                                  description: item.description,
                                  type: item.type,
                                  oauth: oauth && oauth[item.type],
                                  isCustom: item?.isCustom,
                                  link: item?.link,
                                  onClickHandler, onChangeHandler,
                                  save, init, loading,
                              }
                            }
                        />
                    )
                })
            }
        </div>
    )
}

const Item = ({
    description, oauth, type,
    onChangeHandler, onClickHandler,
    save, init, headLine, loading, isCustom, link
}:{
    headLine: string;
    description: string;
    type: string;
    oauth: SystemOAuth.OAuth2Item;
    onClickHandler: (type: string) => void;
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
    save: (type: string) => void;
    init: (type: string) => void;
    loading: {type: string, value: boolean};
    isCustom?: boolean;
    link?: string;
}) => {

    const isLoading = useMemo(() => loading.type === type && loading.value, [loading, type]);

    return (
        <SystemContainer headline={headLine}>
            <div className={'space-y-1.5'}>
                {
                    link
                    && <div className={'list-item ms-4 text-sm text-gray-600 space-x-2'}>
                        <span>키 관련 안내 링크</span>
                        <Link className={'text-blue-500 underline'} href={link}>이동</Link>
                    </div>
                }
                <p className={'list-item ms-4 text-sm text-gray-600 whitespace-pre-line'}>
                    {description}

                </p>
            </div>
            <input className={'w-96 p-2 outline-0 text-sm focus:bg-gray-200 duration-300'}
                   name={'clientId'}
                   value={oauth?.clientId}
                   placeholder={'clientId을 입력하세요'}
                   onChange={(e) => onChangeHandler(e, type)}
            />
            <input className={'w-96 p-2 outline-0 text-sm focus:bg-gray-200 duration-300'}
                   name={'clientSecret'}
                   value={oauth?.clientSecret}
                   placeholder={'clientSecret을 입력하세요'}
                   onChange={(e) => onChangeHandler(e, type)}
            />
            {
                isCustom
                && <input className={'w-96 p-2 outline-0 text-sm focus:bg-gray-200 duration-300'}
                          name={'url'}
                          value={(oauth as SystemOAuth.CustomOAuth2Item)?.url }
                          placeholder={'server URL 주소를 입력하세요'}
                          onChange={(e) => onChangeHandler(e, type)}
                />
            }

            <SystemToggle toggle={oauth?.enabled} onClick={() => onClickHandler(type)}/>

            <div className={'flex space-x-3 items-center'}>
                <button className={`h-8 w-14 flex justify-center items-center ${isLoading ? 'bg-gray-700' : 'bg-blue-600'} rounded text-xs text-white`}
                        onClick={() => save(type)}
                        disabled={isLoading}
                >
                    {
                        isLoading
                            ? <LoadingSpinner size={10} />
                            : '저장'
                    }
                </button>
                <button className={`h-8 w-14 flex justify-center items-center ${isLoading ? 'bg-gray-700' : 'bg-red-600'} rounded text-xs text-white`}
                        onClick={() => init(type)}
                        disabled={isLoading}
                >
                    {
                        isLoading
                            ? <LoadingSpinner size={10} />
                            : '초기화'
                    }
                </button>
            </div>
        </SystemContainer>
    )
}