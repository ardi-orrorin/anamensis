import {ChangeEvent, Dispatch, SetStateAction} from "react";
import {User} from "@/app/login/{services}/types";

export const onChange = (
    e: ChangeEvent<HTMLInputElement>,
    setUser: Dispatch<SetStateAction<User.Login>>
) => {
    setUser((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value
    }))
}