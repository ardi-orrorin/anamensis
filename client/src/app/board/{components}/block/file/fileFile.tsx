'use client';
import {CSSProperties} from "react";
import Link from "next/link";

export type FileFileProps = {
    value: string;
}

export default function FileFile(props: FileFileProps){
    const {value} = props;
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
        borderColor       : 'rgba(100, 100, 100, 1)',
        color             : 'rgba(100, 100, 100, 1)',
        backgroundColor   : 'rgba(240,240,240, 0.5)',
    }

    const downloadUrl = process.env.NEXT_PUBLIC_SERVER + value;

    return (
        <div style={style}>
            <Link style={downloadStyle}
                  href={downloadUrl}
                  download={true}
                  aria-roledescription={'object'}
            >
                <p>
                    {value.split('/').pop()}
                </p>
            </Link>
        </div>
    )
}