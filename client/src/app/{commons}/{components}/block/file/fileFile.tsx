import Image from "next/image";
import {CSSProperties} from "react";
import Link from "next/link";

export default function FileFile({
    value
}: {
    value: string
}){
    const style: CSSProperties = {
        width   : '100%',
        height  : '4rem',
        padding : '0.1rem 0'
    };

    const downloadStyle: CSSProperties = {
        display           : 'flex',
        alignItems        : 'center',
        justifyContent    : 'center',
        width             : '100%',
        height            : '4rem',
        outline           : 'none',
        border            : '1px solid',
        borderRadius      : '0.4rem',
        borderColor       : 'rgba(100, 100, 100, 1)',
        color             : 'rgba(100, 100, 100, 1)',
        backgroundColor   : 'rgba(250,250,250, 1)',
    }

    return (
        <div style={style}>
            <Link style={downloadStyle}
                  href={value}
                  download={true}
            >
                파일 다운로드 : {value}
            </Link>
        </div>
    )
}