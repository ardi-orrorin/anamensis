

interface SignUpI {
    enabled             : boolean;
    emailVerification   : boolean;
}

interface LoginI {
    emailAuth : boolean;
}

export namespace SystemAccount {
    export type SignUp  = SignUpI;
    export type Login   = LoginI;
}