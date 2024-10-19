import React from "react";

const DisabledPage = ({
    title, description
} : {
    title: string,
    description: string
}) => {
    return (
        <div className={'w-full h-dvh flex flex-col gap-4 justify-center items-center'}>
            <h3 className={'text-3xl font-bold text-gray-700'}>{title}</h3>
            <h3 className={'text-xl text-gray-400'}>{description}</h3>
        </div>
    )
}

export default React.memo(DisabledPage, (prev, next) => {
    return prev.title === next.title && prev.description === next.description;
});