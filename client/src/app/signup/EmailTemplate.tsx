import React, {useMemo} from "react";
import {SignUp} from "@/app/signup/{services}/types";

const EmailTemplate = ({
    id, className, emailClickHandler
}: SignUp.EmailTemplateProps) => {

    const emailTemplate = [
        '@gmail.com',
        '@naver.com',
        '@daum.net',
        '@nate.com',
        '@icloud.com',
        '@kakao.com',
        '@outlook.com',
    ];

    const emailToId = useMemo(()=>
        id.split('@')[0]
    ,[id])


    return (
        <div className={['w-full duration-300 overflow-y-scroll', className].join(' ')}>
            {
                emailTemplate.map((domain, index) => {
                    return (
                        <button key={`email-${index}`}
                                className={'w-full h-8 flex justify-center items-center py-5 hover:bg-blue-100 duration-300'}
                                onClick={() => emailClickHandler(emailToId + domain)}
                        >{emailToId}{domain}
                        </button>
                    )
                })
            }
        </div>
    )
};

export default React.memo(EmailTemplate, (prev, next) => {
    return prev.id     === next.id
        && prev.domain === next.domain
});