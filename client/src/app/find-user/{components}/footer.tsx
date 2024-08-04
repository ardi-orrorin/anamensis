import Link from "next/link";
import React from "react";

const Footer = ({
    isSignUp
}:{
    isSignUp?: boolean
}) => {
    return (
        <div className={'flex justify-between px-3'}>
            <Link href={'/find-user'}
                  className={'flex justify-center text-xs text-blue-500'}
            >아이디 찾기</Link>
            {
                isSignUp
                ? <Link href={'/login'}
                      className={'flex justify-center text-xs text-blue-500'}
                >로그인</Link>
                : <Link href={'/signup'}
                        className={'flex justify-center text-xs text-blue-500'}
                >회원 가입</Link>
            }
            <Link href={'/reset-pwd'}
                  className={'flex justify-center text-xs text-blue-500'}
            >비밀번호 찾기</Link>
        </div>
    )
}

export default React.memo(Footer, (prev, next) => {
    return prev.isSignUp === next.isSignUp;
});