import {LoginI} from "@/app/login/{services}/LoginProvider";
import {ChangeEvent, Dispatch, SetStateAction} from "react";

export const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    setUser: Dispatch<SetStateAction<LoginI>>
) => {
    setUser((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
    }))
}