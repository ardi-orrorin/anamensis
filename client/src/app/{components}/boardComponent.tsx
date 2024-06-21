import Link from "next/link";
import {BlockI} from "@/app/board/{services}/types";
import React from "react";
import DefaultBoardComponent from "@/app/{components}/boards/default";
import AlttuelBoardComponent from "@/app/{components}/boards/alttuel";

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
}
const BoardComponent = (props: BoardListI) => {
    const {
       id, body, categoryPk
    } = props;

    const Components = [
        {categoryPk: 1, component: DefaultBoardComponent},
        {categoryPk: 2, component: DefaultBoardComponent},
        {categoryPk: 3, component: DefaultBoardComponent},
        {categoryPk: 4, component: AlttuelBoardComponent},
    ]

    return (
        <Link className={'flex flex-col justify-between w-[350px] min-w-[350px] h-[200px] bg-white shadow active:bg-blue-50 hover:shadow-xl active:shadow-xl duration-300'}
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