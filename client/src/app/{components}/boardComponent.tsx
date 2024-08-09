import Link from "next/link";
import React, {useMemo} from "react";
import DefaultBoardComponent from "@/app/{components}/boards/default";
import AlttuelBoardComponent from "@/app/{components}/boards/alttuel";
import AlbumBoardComponent from "@/app/{components}/boards/album";
import QuestionBoardComponent from "@/app/{components}/boards/question";
import MembersOnlyBody from "@/app/{components}/membersOnlyBody";
import Blocked from "@/app/{components}/boards/blocked";
import CalenderComponent from "@/app/{components}/boards/calender";
import {Root} from "@/app/{services}/types";
import {System} from "@/app/user/system/{services}/types";

const BoardComponent = (props: Root.BoardListI & {favorites: string[], isLogin: boolean}) => {
    const {
       id, body,
        categoryPk, favorites,
        isLogin, membersOnly, isBlocked,
        roles,
    } = props;


    const membersOnlyBody = useMemo(() =>
        membersOnly && !isLogin
    ,[membersOnly, isLogin]);

    const Components = useMemo(()=>[
        {categoryPk: 1, component: DefaultBoardComponent},
        {categoryPk: 2, component: DefaultBoardComponent},
        {categoryPk: 3, component: QuestionBoardComponent},
        {categoryPk: 4, component: AlttuelBoardComponent},
        {categoryPk: 5, component: AlbumBoardComponent},
        {categoryPk: 6, component: CalenderComponent},
    ],[membersOnlyBody]);

    const isFavorite = useMemo(() =>
        favorites?.find(boardPk => id.toString() === boardPk.toString())
    , [favorites, id]);

    const Component = useMemo(() => {
        if(isBlocked) return <Blocked {...props} />;
        if(membersOnlyBody) return <MembersOnlyBody {...props} />;

        return Components.find((component) =>
            component.categoryPk === Number(categoryPk)
        )?.component(props)
    },[categoryPk, body])

    const highLight = useMemo(() =>
        (isFavorite || Number(categoryPk) === 1) && !isBlocked
    ,[]);

    const notAdminBlocked = useMemo(() =>
        isBlocked && !roles.includes(System.Role.ADMIN)
    ,[isBlocked, roles]);

    return (
        <>
            {
                notAdminBlocked
                ? <span className={
                    'relative flex flex-col justify-between w-full h-[170px] bg-white border-gray-200 border-solid border rounded shadow active:bg-blue-50 duration-300'
                }>
                    { Component }
                </span>
                : <Link className={[
                    'relative flex flex-col justify-between w-full h-[170px] border-solid border rounded shadow active:bg-blue-50 hover:shadow-md  active:shadow-md duration-300',
                    isFavorite && !isBlocked ? 'border-yellow-300 hover:border-yellow-500 active:bg-yellow-300' : 'bg-white border-gray-200 hover:border-gray-500 active:bg-gray-300',
                    highLight && 'border-t-5'
                ].join(' ')}
                        href={`/board/${id}`}
                        prefetch={true}
                >
                    { Component }
                </Link>
            }
        </>
    )
}

export default React.memo(BoardComponent);