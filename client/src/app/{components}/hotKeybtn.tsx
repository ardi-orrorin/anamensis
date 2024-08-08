import React from "react";

const HotKeyBtn = ({hotkey}: {hotkey: string[]}) => {
    return (
        <div className={'flex gap-1'}>
            {
                hotkey.map((key, index) => {
                    return (
                        <span key={'hotkeybtn' + index} className={`text-xss py-0.5 px-1 min-w-5 flex justify-center border border-solid border-gray-300 rounded shadow`}>
                            {key}
                        </span>
                    )
                })
            }
        </div>
    )
}

export default React.memo(HotKeyBtn, () => true);