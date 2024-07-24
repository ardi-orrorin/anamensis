import moment from "moment/moment";
import {RoleType} from "@/app/user/system/{services}/types";
import {UsersRole} from "@/app/user/users-role/page";
import React, {useMemo} from "react";

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
    onChangeRole: (mode: 'add' | 'delete', user: UsersRole, selRole : RoleType) => void
}) => {

    const rolesOption = useMemo(()=>
        user.roles.map(role => {
            if(role === 'MASTER') return;
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
        <tr key={'user-role' + user.id} className={['border-b border-gray-200 border-solid', index % 2 === 1 ? 'bg-blue-50': '', select.includes(user.id) && 'bg-yellow-300'].join(' ')}>
            <td className={'py-2 px-3'}>
                <input type={'checkbox'}
                       checked={!!select.find(id => id === user.id)}
                       onClick={() =>onSelectHandler(user.id)}
                />
            </td>
            <td className={'py-2 px-3'}>
                { maxIndex - index }
            </td>
            <td className={'py-4 px-3'}>
                { user.userId }
            </td>
            <td className={'py-2 px-3'}>
                { user.name }
            </td>
            <td className={'py-2 px-3'}>
                { user.email }
            </td>
            <td className={'py-2 px-3'}>
                { roles }
            </td>
            <td className={'py-2 px-3'}>
                { moment(user.createAt).format('YYYY-MM-DD HH:mm') }
            </td>
            <td className={'text-center'}>
                { user.isUse ? '사용' : '비사용' }
            </td>
            <td className={'py-2 px-3'}>
                <select className={'w-full bg-none outline-0'} onChange={e => onChangeRole('add', user, e.target.value as RoleType)}>
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
                <select className={'w-full bg-none outline-0'} onChange={e => onChangeRole('delete', user, e.target.value as RoleType)}>
                    <option value={''}>선택</option>
                    { rolesOption }
                </select>
            </td>
        </tr>
    )
}

export default React.memo(Row);