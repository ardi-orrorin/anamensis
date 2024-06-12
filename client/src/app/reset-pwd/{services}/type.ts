export type FindUser = {
    email: string;
    verifyCode: string;
    isVerify: boolean;
}

export type FindUserResponse = {
    verified: boolean;
    userId: string;
}