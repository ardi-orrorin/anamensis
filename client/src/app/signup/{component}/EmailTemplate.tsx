import {Dispatch, useMemo} from "react";
import {UserProps} from "@/app/signup/page";

export type EmailTemplateProps = {
    className? : string;
    id         : string;
    domain     : string;
    order      : number;
    user       : UserProps;
    setEmailSelect: Dispatch<React.SetStateAction<boolean>>;
    setUser    : Dispatch<React.SetStateAction<UserProps>>;
}

const EmailTemplate = ({
    id, className, user, setUser, setEmailSelect
}:EmailTemplateProps) => {
    const emailTemplate = [
        '@gmail.com',
        '@naver.com',
        '@daum.net',
        '@nate.com',
        '@icloud.com',
        '@kakao.com',
        '@outlook.com',
    ];
    const emailToId = useMemo(()=> {
            return id.split('@')[0]}
        ,[id]) ;

    const emailClickHandler = (value: string) => {
        setUser({
            ...user,
            email: value
        });
        setEmailSelect(true);
    }
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

export default EmailTemplate;