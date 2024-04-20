'use client';

import {useEffect, useState} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import axios from "axios";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRouter} from "next/navigation";


export interface SmtpProps {
    id?: number;
    host: string;
    port: string;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
    options: string[];
}

export interface SmtpI {
    host: string;
    port: string;
    username: string;
    password: string;
    fromEmail: string;
    fromName: string;
    useSSL: boolean;
    isDefault: boolean;
}
export interface SmtpTestProps {
    result: boolean;
    message: string;
}

interface SmtpPropsI {
    searchParams: URLQuery;
}

interface URLQuery extends URLSearchParams {
    // @ts-ignore
    [key: string]: string;
}

const getServerSideProps: GetServerSideProps<SmtpPropsI> = async (context) => {
    const searchParams = new URLSearchParams(context.query as any) as URLQuery;
    return {
        props: {
            searchParams,
        }
    }
}

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const {searchParams} = props;

    const router = useRouter();

    const [hasTest, setHasTest] = useState<boolean>(false)
    const [smtp, setSmtp] = useState<SmtpProps>({} as SmtpProps);
    const [loading, setLoading] = useState<boolean>(false);
    const [testResult, setTestResult] = useState<SmtpTestProps>({} as SmtpTestProps);

    useEffect(() => {
        if(searchParams?.id) {
            axios.get('/api/user/smtp', {
                params: {
                    id: searchParams?.id
                }
            })
            .then(res => {
                const data = res.data as SmtpProps;
                setSmtp({
                    id: data.id,
                    host: data.host,
                    port: data.port,
                    username: data.username,
                    password: data.password,
                    fromEmail: data.fromEmail,
                    fromName: data.fromName,
                    options: data.options
                })
            })
        }
    },[props.searchParams]);

    const setSmtpHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(hasTest) setHasTest(false);
        setSmtp({...smtp, [e.target.name]: e.target.value})
    }

    const transformSmtp = (smtp: SmtpProps): SmtpI => {
        const options: string[] = Object.keys(smtp);
        return {
            host: smtp.host,
            port: smtp.port,
            username: smtp.username,
            password: smtp.password,
            fromEmail: smtp.fromEmail,
            fromName: smtp.fromName,
            useSSL: options.includes('isSSL') || false,
            isDefault: options.includes('isDefault') || false
        }
    }

    const testSmtp = async () => {
        const data = transformSmtp(smtp);
        setLoading(true);
        await axios.post('/api/user/smtp/test', data ,{
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then((res) => {
            setHasTest(true);
            setTestResult({
                result: res.data as boolean,
                message: res.data ? '연결 성공' : '연결 실패'
            })
        }).finally(() => {
            setLoading(false);
        });
    }

    const save = () => {
        setLoading(true);
        const data = transformSmtp(smtp);
        axios.post('/api/user/smtp', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            setSmtp({
                host: '',
                port: '',
                username: '',
                password: '',
                fromEmail: '',
                fromName: '',
                options: []
            })
            window.location.reload();

        })
        .finally(() => {
            setLoading(false);
        });
    }

    const modify = () => {

    }

    const init = () => {
        window.location.search = '';
    }

    const inputStyle = 'w-full outline-0 focus:bg-blue-50 p-2 text-sm rounded duration-500';
    const btnStyle = ['w-full text-white p-2 rounded duration-500', !loading ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-400 hover:bg-gray-600'].join(' ');

    return (
        <div className={'flex flex-col gap-3 px-2'}>
            <h1>SMTP 등록</h1>
            <input className={inputStyle}
                   placeholder={'host을 입력하세요'}
                   name={'host'}
                   value={smtp.host}
                   onChange={setSmtpHandler}

            />
            <input className={inputStyle}
                   placeholder={'port를 입력하세요'}
                   name={'port'}
                   value={smtp.port}
                   onChange={setSmtpHandler}
            />
            <input className={inputStyle}
                   placeholder={'username을 입력하세요'}
                   name={'username'}
                   value={smtp.username}
                   onChange={setSmtpHandler}
            />
            <input className={inputStyle}
                   placeholder={'password을 입력하세요'}
                   name={'password'}
                   value={smtp.password}
                   onChange={setSmtpHandler}
            />
            <input className={inputStyle}
                   placeholder={'fromEmail을 입력하세요'}
                   name={'fromEmail'}
                   value={smtp.fromEmail}
                   onChange={setSmtpHandler}
            />
            <input className={inputStyle}
                   placeholder={'fromName을 입력하세요'}
                   name={'fromName'}
                   value={smtp.fromName}
                   onChange={setSmtpHandler}
            />
            <div className={'flex gap-3'}>
                <input type={'checkbox'}
                       id={'isSSL'}
                       name={'isSSL'}
                       value={smtp.options}
                       checked={smtp.options?.includes('isSSL')}
                       onChange={setSmtpHandler}
                />
                <label className={'text-sm'}
                       htmlFor={'isSSL'}
                >SSL</label>
            </div>
            <div className={'flex gap-3'}>
                <input type={'checkbox'}
                       id={'isDefault'}
                       name={'isDefault'}
                       value={smtp.options}
                       checked={smtp.options?.includes('isDefault')}
                       onChange={setSmtpHandler}
                />
                <label className={'text-sm'}
                       htmlFor={'isDefault'}
                >Default</label>
            </div>
            {
                hasTest &&
                <div className={['text-sm', testResult.result ? 'text-green-500' : 'text-red-500'].join(' ')}>
                    {testResult.message}
                </div>
            }
            {
                (!hasTest || !testResult.result) &&
                <button className={btnStyle}
                        onClick={testSmtp}
                        disabled={loading}
                >
                    {
                        loading
                            ? <LoadingSpinner size={10} />
                            : '테스트'

                    }
                </button>
            }
            {
                hasTest && testResult.result && !searchParams?.id &&
                <button className={btnStyle}
                      onClick={save}
                      disabled={loading}
                >저장
                </button>
            }
            {
                hasTest && testResult.result && searchParams?.id &&
                <button className={btnStyle}
                        onClick={modify}
                        disabled={loading}
                >수정
                </button>
            }
            {
                searchParams?.id &&
                <button className={btnStyle}
                        onClick={init}
                        disabled={loading}
                >변경 취소</button>

            }
        </div>
    )
}