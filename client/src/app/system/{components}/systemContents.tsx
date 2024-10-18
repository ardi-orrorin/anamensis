import React, {Suspense} from "react";
import GlobalLoadingSpinner from "@/app/{commons}/GlobalLoadingSpinner";

const SystemContents = ({children}: {children: React.ReactNode}) => {
    return (
        <section className={'w-full h-full flex flex-col border-s border-solid border-gray-200 p-4'}>
            <div className={'h-full'}>
                <Suspense fallback={<GlobalLoadingSpinner />}>
                    {children}
                </Suspense>
            </div>
        </section>
    )
}

export default React.memo(SystemContents);