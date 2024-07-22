import {CSSProperties, useMemo} from "react";
import Image from "next/image";
import {MouseLeaveHTMLElements} from "@/app/board/{components}/block/type/Types";

export type FileImageProps = {
    value: string;
    onMouseEnterHandler: (e: React.MouseEvent<MouseLeaveHTMLElements>) => void;
    onMouseLeaveHandler: (e: React.MouseEvent<MouseLeaveHTMLElements>) => void;
}

export default function FileImage(props: FileImageProps){
    const {value, onMouseEnterHandler, onMouseLeaveHandler} = props;

    const thumb = useMemo(() =>
        value.replace(/(\.[^.]+)$/, '_thumb$1')
    ,[value]);

    const url = process.env.NEXT_PUBLIC_CDN_SERVER + thumb;

    return (
        <div className={'w-full flex justify-center items-center object-cover'}
             onMouseEnter={onMouseEnterHandler}
             onMouseLeave={onMouseLeaveHandler}
             aria-roledescription={'object'}
        >
            <Image src={url}
                   alt={''}
                   height={700}
                   width={700}
                   className={'w-auto h-auto'}
                   priority={true}
            />
        </div>
    )

}