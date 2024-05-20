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
    }
    const onLoadingComplete = (e: HTMLImageElement ) => {
        const multiple = e.srcset.split(',')[1].split(' ')[1];
    }

    return (
        <div style={style}>
            <Image src={url}
                   alt={''}
                   height={700}
                   width={700}
                   onMouseEnter={onMouseEnterHandler}
                   onMouseLeave={onMouseLeaveHandler}
                   priority={true}
                   onLoadingComplete={onLoadingComplete}
            />
        </div>
    )

}