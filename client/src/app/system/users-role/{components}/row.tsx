import moment from "moment/moment";
import {UsersRole} from "@/app/system/users-role/page";
import React, {useMemo} from "react";
import {System} from "@/app/system/message/{services}/types";

const Row = ({
    user,
    index,
    maxIndex,
    select,
    onSelectHandler,
    onChangeRole
}:{
    user: UsersRole
    index: number
    maxIndex: number
    select: number[]
    onSelectHandler: (id: number) => void
    onChangeRole: (mode: 'add' | 'delete', user: UsersRole, selRole : System.Role) => void
}) => {

    const rolesOption = useMemo(()=>
        user.roles.map(role => {
            if(role === 'MASTER' || role === 'OAUTH') return;
            return (
                <option key={'user-role-roles-option' + role}
                        value={role}
                >{ role }
                </option>
            )
        })
    ,[user.roles]);

    const roles = useMemo(() =>
        user.roles.map(role =>
            <span key={'user-role-roles' + role}
                  className={'text-sm px-1'}
            >{ role }
            </span>
        )
    ,[user.roles])

    return (
        <tr key={'user-role' + user.id} className={['border-b border-gray-200 border-solid', index % 2 === 1 ? 'bg-gray-50': '', select.includes(user.id) && 'bg-yellow-400'].join(' ')}>
            <td className={'py-2 px-3'}>
                <input type={'checkbox'}
                       checked={!!select.find(id => id === user.id)}
                       onClick={() =>onSelectHandler(user.id)}
                />
            </td>
            <td className={'py-2 px-3'}>
                { maxIndex - index }
            </td>
            <td className={'py-2 px-3'}>
                <div className={'flex flex-col gap-2'}>
                    <span className={'break-all'}>{ user.userId }</span>
                    <span className={'break-all'}>({ user.name })</span>
                </div>
            </td>
            <td className={'py-2 px-3'}>
                { user.email }
            </td>
            <td className={'py-2 px-3 break-all'}>
                { roles }
            </td>
            <td className={'py-2 px-3'}>
                { moment(user.createAt).format('YYYY-MM-DD HH:mm') }
            </td>
            <td className={'text-center'}>
                { user.isUse ? '사용' : '비사용' }
            </td>
            <td className={'py-2 px-3'}>
                <select className={'w-full bg-none outline-0'} onChange={e => onChangeRole('add', user, e.target.value as System.Role)}>
                    <option value={''}>선택</option>
                    {
                        !user.roles.includes('ADMIN')
                        && <option value={'ADMIN'}>ADMIN</option>
                    }
                    {
                        !user.roles.includes('GUEST')
                        && <option value={'GUEST'}>GUEST</option>
                    }
                </select>
            </td>
            <td className={'py-2 px-3'}>
                <select className={'w-full bg-none outline-0'} onChange={e => onChangeRole('delete', user, e.target.value as System.Role)}>
                    <option value={''}>선택</option>
                    { rolesOption }
                </select>
            </td>
        </tr>
    )
}

export default React.memo(Row);