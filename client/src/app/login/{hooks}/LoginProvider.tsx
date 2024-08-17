import {
    ChangeEvent,
    createContext,
    Dispatch,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import {User} from "@/app/login/{services}/types";
import apiCall from "@/app/{commons}/func/api";

export interface LoginProviderI {
    user    : User.Login;
    loading : boolean;
    verify  : () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error   : User.ErrorResponse;
    goLogin : () => void;
    setProps: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LoginContext = createContext<LoginProviderI>({} as LoginProviderI);

export const LoginProvider = ({children} : {children: React.ReactNode}) => {

    const [loading, setLoading] = useState(false);

    const [user, setUser] = useState<User.Login>({
        username: '',
        password: '',
        authType: User.AuthType.INTRO,
    });

    const [error, setError] = useState<User.ErrorResponse>({
        status: 0,
        message: '',
        use: false
    });

    useEffect(() => {
        if (user.username.length < 4) {
            setUser({
                ...user,
                password: ''
            });
        }
    }, [user.username]);

    const verify = useCallback(async () => {
        setLoading(true);
        await apiCall<User.LoginResponse, User.Login>({
            path: '/api/login/verify',
            method: 'POST',
            body: user,
            call: 'Proxy'
        }).then(res => {
            window.location.replace('/');
        }).catch(err => {
            console.log(err)
        }).finally(() => {
            setLoading(false);
        });
    },[user]);

    const goLogin = useCallback(async () => {
        setLoading(true);

        await apiCall<User.Auth, User.Login>({
            path: '/api/login',
            method: 'POST',
            body: user,
            call: 'Proxy'
        }).then(res => {
            setUser({
                ...user,
                verify: res.data.verity,
                authType: res.data.authType
            });
        }).catch(err => {
            setError({
                status: err.response.status,
                message: err.response.data,
                use: true
            });
        }).finally(() => {
            setLoading(false);
        });
    },[user]);

    const setProps = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setUser({
            ...user,
            [name]: value
        });

        error.use
        && setError({
            status: 0,
            message: '',
            use: false
        });
    },[user, error]);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUser((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    },[user]);

    return (
        <LoginContext.Provider value={{
            user, loading,
            verify, onChange,
            error, goLogin, setProps
        }}>
            {children}
        </LoginContext.Provider>
    )
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) throw new Error('useLogin must be used within a LoginProvider');
    return context;
}



