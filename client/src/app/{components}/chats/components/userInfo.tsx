import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import Image from "next/image";
import {defaultProfile} from "@/app/{commons}/func/image";
import userInfoApiService from "@/app/user/info/{services}/userInfoApiService";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useMemo} from "react";
import {ActiveMenuEnum, useChatMenu} from "@/app/{components}/chats/hook/useChatMenu";
import apiCall from "@/app/{commons}/func/api";
import {AxiosError} from "axios";
import {StatusEnum, UserStatus} from "@/app/{components}/chats/services/Status";

const UserInfo = () => {

    const {ws, userInfo, userInfoHandler, users} = useWebSocket();
    const {changeActiveMenuHandler} = useChatMenu();
    const {data: userinfo} = useQuery(userInfoApiService.profile())

    const userStatus = useMemo(() => {
        const status = users.find(user => user.username === userInfo.userId)?.status
            ?? StatusEnum.OFFLINE

        return UserStatus.fromString(status) ?? UserStatus.OFFLINE;
    }, [users, userInfo.userId]);

    useEffect(() => {
        if(userinfo?.userId) return;
        userInfoHandler(userinfo.userId);
    }, [ws]);

    const onClickHandler = async () => {
        try {
            const res = await apiCall<number>({
                path: '/api/chat/chatroom/partner/' + userInfo.userId,
                call: 'Proxy',
                method: 'GET',
                isReturnData: true,
            });

            changeActiveMenuHandler(ActiveMenuEnum.CHAT, res);
        } catch (e) {
            const err = e as AxiosError;

            if(err.response?.status === 500) {
                alert('채팅방 생성에 실패했습니다.');
            }

            console.error(err);
        }
    }

    return (
        <div className={'w-full py-4 flex flex-col gap-3 items-center justify-center'}>
            <Image className={'w-20 h-20 rounded-full'}
                   src={defaultProfile(userInfo.profileImage)}
                   width={80}
                   height={80}
                   alt={''}
                   onError={(e) => {
                      e.currentTarget.src = defaultProfile("")
                   }}
            />
            <div>
                <span className={`text-${userStatus.color}`}>{userStatus.name}</span>
            </div>
            <div className={'w-full'}>
                <table className={'w-[70%] m-auto'}>
                    <colgroup>
                        <col style={{width: '30%'}}/>
                        <col style={{width: '70%'}}/>
                    </colgroup>
                    <tbody>
                    <tr>
                        <td>아이디</td>
                        <td>{userInfo.userId}</td>
                    </tr>
                    <tr>
                        <td>이름</td>
                        <td>{userInfo.name}</td>
                    </tr>
                    <tr>
                        <td>이메일</td>
                        <td>{userInfo.email}</td>
                    </tr>
                    <tr>
                        <td>연락처</td>
                        <td>{userInfo.phone}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div>
                <button className={'w-16 h-8 text-xs rounded bg-gray-700 text-white'}
                        onClick={onClickHandler}
                >
                    대화하기
                </button>
            </div>
        </div>
    )
}


export default UserInfo;