import {CSSProperties} from "react";
import Image from "next/image";

export type FileImageProps = {
    value: string;
    onMouseEnterHandler: (e: React.MouseEvent<HTMLImageElement | HTMLInputElement>) => void;
    onMouseLeaveHandler: (e: React.MouseEvent<HTMLImageElement | HTMLInputElement>) => void;
}

export default function FileImage(props: FileImageProps){
    const {value, onMouseEnterHandler, onMouseLeaveHandler} = props;
    const url = process.env.NEXT_PUBLIC_CDN_SERVER + value;

    const style: CSSProperties = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        objectFit: 'cover',
    }

    return (
        <div style={style}>
            <Image src={url}
                   alt={''}
                   height={700}
                   width={700}
                   className={'w-auto h-auto'}
                   priority={true}
                   onMouseEnter={onMouseEnterHandler}
                   onMouseLeave={onMouseLeaveHandler}
                   aria-roledescription={'object'}

            />
        </div>
    )

}