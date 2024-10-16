import {useMemo} from "react";
import Image from "next/image";
import {MouseLeaveHTMLElements} from "@/app/board/{components}/block/type/Types";
import {defaultNoImg} from "@/app/{commons}/func/image";

export type FileImageProps = {
    value: string;
    onMouseEnterHandler: (e: React.MouseEvent<MouseLeaveHTMLElements>) => void;
    onMouseLeaveHandler: (e: React.MouseEvent<MouseLeaveHTMLElements>) => void;
}

export default function FileImage(props: FileImageProps){
    const {
        value, onMouseEnterHandler, onMouseLeaveHandler
    } = props;

    const thumb = useMemo(() =>
        value.replace(/(\.[^.]+)$/, '_thumb$1')
    ,[value]);

    return (
        <div className={'w-full flex justify-center items-center object-cover'}
             onMouseEnter={onMouseEnterHandler}
             onMouseLeave={onMouseLeaveHandler}
             aria-roledescription={'object'}
        >
            <Image src={defaultNoImg(thumb)}
                   alt={''}
                   height={700}
                   width={700}
                   className={'w-auto h-auto'}
                   priority={true}
                   onError={(e) => {
                      e.currentTarget.src = defaultNoImg('')
                   }}
            />
        </div>
    )

}