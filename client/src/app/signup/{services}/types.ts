import React from "react";

type CheckTypeT = 'check' | 'uncheck' | 'notCheck';

interface UserPropsI {
    id            : string;
    pwd           : string;
    pwdCheck      : string;
    name          : string;
    email         : string;
    emailCheck    : string;
    phone         : string;
    emailVerified : boolean;
    [key: string] : string | boolean;
}

type CheckPropsT = {
    id            : CheckTypeT;
    pwd           : CheckTypeT;
    pwdCheck      : CheckTypeT;
    name          : CheckTypeT;
    email         : CheckTypeT;
    emailCheck    : CheckTypeT;
    phone         : CheckTypeT;
    [key: string] : CheckTypeT;
}

type DescriptionPropsT = {
    id            : string;
    pwd           : string;
    pwdCheck      : string;
    name          : string;
    email         : string;
    emailCheck    : string;
    phone         : string;
    [key: string] : string;
}

type ExistPropsT = {
    type         : string;
    value        : string;
    [key: string]: string;
}

type RowPropsT = {
    className?  : string;
    name        : string;
    value       : UserPropsI;
    type?       : string;
    check       : CheckPropsT;
    placeholder : string;
    setProps    : (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputCheck  : (eleId: CheckTypeT) => string;
    disabled?   : boolean;
    description?: string;
    autoFocus?  : boolean;
}

type EmailTemplatePropsT = {
    className? : string;
    id         : string;
    domain     : string;
    order      : number;
    emailClickHandler : (value: string) => void;
}

export namespace SignUp {
    export type UserProps = UserPropsI;
    export type CheckProps = CheckPropsT;
    export type DescriptionProps = DescriptionPropsT;
    export type ExistProps = ExistPropsT;
    export type RowProps = RowPropsT;
    export type EmailTemplateProps = EmailTemplatePropsT;
    export type CheckType = CheckTypeT;
}