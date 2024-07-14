import Link from "next/link";
import {BlockI} from "@/app/board/{services}/types";
import React from "react";
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

const BoardComponent = (props: BoardListI) => {
    const {
       id, body, categoryPk
    } = props;

    const Components = [
        {categoryPk: 1, component: DefaultBoardComponent},
        {categoryPk: 2, component: DefaultBoardComponent},
        {categoryPk: 3, component: QuestionBoardComponent},
        {categoryPk: 4, component: AlttuelBoardComponent},
        {categoryPk: 5, component: AlbumBoardComponent},
    ]

    return (
        <Link className={'flex flex-col justify-between w-full h-[150px] bg-white border-solid border border-gray-200 rounded shadow active:bg-blue-50 hover:shadow-xl active:shadow-xl duration-300'}
        // <Link className={'flex flex-col justify-between w-full sm:w-[350px] sm:min-w-[350px] h-[200px] bg-white border-solid border border-gray-200 rounded shadow active:bg-blue-50 hover:shadow-xl active:shadow-xl duration-300'}
              href={`/board/${id}`}
              prefetch={true}
        >
            {
                Components.find((component) =>
                    component.categoryPk === Number(categoryPk)
                )?.component(props)
            }
        </Link>
    )
}




export default BoardComponent;