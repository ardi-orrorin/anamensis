import {useWebSocket} from "@/app/{components}/chats/hook/useWebSocket";
import Image from "next/image";
import {defaultProfile} from "@/app/{commons}/func/image";

const UserInfo = () => {

    const {ws, userInfo, findChatRoomId} = useWebSocket();

    return (
        <div className={'w-full py-4 flex flex-col gap-5 items-center justify-center'}>
            <Image className={'w-20 h-20 rounded-full'}
                   src={defaultProfile(userInfo.profileImage)}
                   width={80}
                   height={80}
                   alt={''}
                   onError={(e) => {
                      e.currentTarget.src = defaultProfile("")
                   }}
            />
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
                        onClick={() => findChatRoomId(userInfo.userId)}
                >
                    대화하기
                </button>
            </div>
        </div>
    )
}


export default UserInfo;