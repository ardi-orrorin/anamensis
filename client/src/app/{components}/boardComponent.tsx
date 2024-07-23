import Link from "next/link";
import {BlockI} from "@/app/board/{services}/types";
import React, {useMemo} from "react";
import DefaultBoardComponent from "@/app/{components}/boards/default";
import AlttuelBoardComponent from "@/app/{components}/boards/alttuel";
import AlbumBoardComponent from "@/app/{components}/boards/album";
import QuestionBoardComponent from "@/app/{components}/boards/question";

export interface BoardListI {
    id           : string;
    categoryPk   : string;
    title        : string;
    viewCount    : number;
    rate         : number;
    writer       : string;
    profileImage?: string;
    createdAt    : string;
    commentCount : number;
    body?        : BlockI[];
    isPublic     : boolean;
    membersOnly  : boolean;
}

const BoardComponent = (props: BoardListI & {favorites: string[]}) => {
    const {
       id, body, categoryPk, favorites
    } = props;

    const Components = useMemo(()=>[
        {categoryPk: 1, component: DefaultBoardComponent},
        {categoryPk: 2, component: DefaultBoardComponent},
        {categoryPk: 3, component: QuestionBoardComponent},
        {categoryPk: 4, component: AlttuelBoardComponent},
        {categoryPk: 5, component: AlbumBoardComponent},
    ],[]);

    const isFavorite = useMemo(() =>
        favorites?.find(boardPk => id.toString() === boardPk.toString())
    , [favorites, id]);

    const Component = useMemo(() =>
        Components.find((component) =>
            component.categoryPk === Number(categoryPk)
        )?.component(props)
    ,[categoryPk])

    return (
        <Link className={[
            'relative flex flex-col justify-between w-full h-[170px] border-solid border rounded shadow active:bg-blue-50 hover:shadow-xl  active:shadow-xl duration-300',
            isFavorite ? 'border-amber-200 hover:border-amber-500 bg-amber-50' : 'bg-white border-gray-200 hover:border-gray-500'
        ].join(' ')}
              href={`/board/${id}`}
              prefetch={true}
        >
            { Component }
        </Link>
    )
}

export default React.memo(BoardComponent);