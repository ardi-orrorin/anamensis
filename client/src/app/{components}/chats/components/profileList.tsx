import {UserStatus} from "@/app/{components}/chats/services/Status";
import {defaultProfile} from "@/app/{commons}/func/image";
import React from "react";
import {useQuery} from "@tanstack/react-query";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import {ActiveMenuEnum, useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";

const ProfileList = () => {

    const {data: userinfo} = useQuery(userInfoApiService.profile())

    const {users, userInfoHandler}  = useWebSocket();

    const {changeActiveMenuHandler} = useChatMenu();

    const onClickUser = (username: string) => {
        return userInfoHandler(username)
            .then(() => changeActiveMenuHandler(ActiveMenuEnum.INFO, 0));
    }

    return (
        <div className={'w-full max-h-80 flex flex-col gap-0.5 overflow-y-auto'}>
            {
                users?.length > 0
                && users.map((user, index) => {
                    const status = UserStatus.fromString(user.status) ?? UserStatus.ONLINE;

                    return (
                        <button key={`profile-${user.id}`}
                                className={`px-2 py-2 flex justify-between items-center hover:bg-gray-300 duration-300 ${index === 0 && 'border-b-2 border-solid border-gray-200'}`}
                                onClick={() => onClickUser(user.username)}
                        >
                            <div className={'flex gap-2 items-center'}>
                                <img className={`w-7 h-7 rounded`}
                                     src={defaultProfile(user.profileImage)}
                                     alt={''}
                                     onError={(e) => {
                                         e.currentTarget.src = defaultProfile("")
                                     }}/>
                                <span>{user.username}</span>
                                {
                                    userinfo.name === user.username
                                    && <span className={'text-xs text-blue-500 font-bold'}>
                                        ( 본인 )
                                    </span>
                                }
                            </div>
                            <span className={`flex items-center text-xs text-${status.color}`}>
                                {status.name}
                            </span>
                        </button>
                    )
                })
            }
        </div>
    )

}

export default React.memo(ProfileList);