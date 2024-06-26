import {CSSProperties} from "react";
import Image from "next/image";
import {MouseLeaveHTMLElements} from "@/app/board/{components}/block/type/Types";

export type FileImageProps = {
    value: string;
    onMouseEnterHandler: (e: React.MouseEvent<MouseLeaveHTMLElements>) => void;
    onMouseLeaveHandler: (e: React.MouseEvent<MouseLeaveHTMLElements>) => void;
}

export default function FileImage(props: FileImageProps){
    const {value, onMouseEnterHandler, onMouseLeaveHandler} = props;

    const thumb = value.replace(/(\.[^.]+)$/, '_thumb$1');

    const url = process.env.NEXT_PUBLIC_CDN_SERVER + thumb;

    const style: CSSProperties = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        objectFit: 'cover',
    }

    return (
        <div style={style}
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