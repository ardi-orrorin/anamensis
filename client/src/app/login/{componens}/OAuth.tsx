import {getProviders, signIn} from "next-auth/react";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {User} from "@/app/login/{services}/types";

const OAuth = ({
    isRecaptcha
}: {
    isRecaptcha: boolean;
}) => {

    const [provider, setProvider] = useState<any>({});

    useEffect(() => {
        getProviders()
        .then((providers) => {
            setProvider(providers)
        });
    },[]);

    if(Object?.values(provider)?.length === 0) return <></>;

    return (
        Object?.values(provider)?.map((provider) => {
            const { id, name} = provider as {id: string, name: string};
            const logoImg = process.env.NEXT_PUBLIC_CDN_SERVER + '/logo/' + id + '-logo.webp';
            const {bgColor, hoverBgColor, size} = oAuthProviders.find(o => o.provider === id)
            || {bgColor: 'gray-300', hoverBgColor: 'gray-600'};

            return (
                <button className={[
                            `w-full h-11 flex justify-center items-center gap-1 text-xs text-white rounded duration-300`,
                            `${bgColor} hover:${hoverBgColor}`,
                        ].join(' ')}
                        key={'oauth-login' + id}
                        onClick={() => signIn(id)}
                        disabled={!isRecaptcha}
                >
                    <Image src={logoImg}
                           alt={''}
                           width={size ?? 10}
                           height={size ?? 10}
                    />
                    <span className={'font-bold'}>
                        Sign in with {name}
                    </span>
                </button>
            )
        })
    )
}


const oAuthProviders: User.OAuthProvider[] = [
    { provider: 'google',    bgColor: 'bg-red-300',    hoverBgColor: 'bg-red-600',    size: 16,   },
    { provider: 'facebook',  bgColor: 'bg-blue-300',   hoverBgColor: 'bg-blue-600',   size: 16,   },
    { provider: 'twitter',   bgColor: 'bg-blue-500',   hoverBgColor: 'bg-blue-800',   size: 16,   },
    { provider: 'instagram', bgColor: 'bg-pink-300',   hoverBgColor: 'bg-pink-600',   size: 16,   },
    { provider: 'naver',     bgColor: 'bg-green-300',  hoverBgColor: 'bg-green-600',  size: 20,   },
    { provider: 'kakao',     bgColor: 'bg-amber-300',  hoverBgColor: 'bg-amber-700',  size: 18,   },
    { provider: 'github',    bgColor: 'bg-gray-600',   hoverBgColor: 'bg-gray-900',   size: 18,   },
    { provider: 'ardi',      bgColor: 'bg-gray-300',   hoverBgColor: 'bg-gray-500',   size: 18,   },
];

export default React.memo(OAuth, (prev, next) => {
    return prev.isRecaptcha === next.isRecaptcha;
});