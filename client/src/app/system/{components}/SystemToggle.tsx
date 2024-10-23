import React from "react";

const Toggle = ({
    toggle, onClick
}: {
    toggle  : boolean,
    onClick : () => void
}) => {
    return (
        <div
            className={`relative w-12 h-6 ${toggle ? 'bg-gray-700' : 'bg-gray-300'} rounded cursor-pointer transition duration-300 ease-in-out drop-shadow`}
            onClick={onClick}
        >
            <div
                className={`absolute w-6 h-6 bg-white drop-shadow-md rounded transform transition-transform duration-300 ease-in-out ${toggle ? 'translate-x-6' : ''}`}
            ></div>
        </div>
    )
}

export default React.memo(Toggle, (prevProps, nextProps) => {
    return prevProps.toggle === nextProps.toggle
    && prevProps.onClick === nextProps.onClick
});