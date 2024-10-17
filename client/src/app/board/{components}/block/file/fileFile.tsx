'use client';
import {CSSProperties, useMemo} from "react";
import Link from "next/link";
import rootApiService from "@/app/{services}/rootApiService";
import {useQuery} from "@tanstack/react-query";

export type FileFileProps = {
    value: string;
}

export default function FileFile(props: FileFileProps){
    const {value} = props;
    const style: CSSProperties = useMemo(() => ({
        width   : '100%',
        height  : '4rem',
        padding : '0.1rem 0'
    }),[]);

    const downloadStyle: CSSProperties = useMemo(() => ({
        display           : 'flex',
        alignItems        : 'center',
        justifyContent    : 'center',
        width             : '100%',
        height            : '4rem',
        outline           : 'none',
        borderColor       : 'rgba(100, 100, 100, 1)',
        color             : 'rgba(100, 100, 100, 1)',
        backgroundColor   : 'rgba(240,240,240, 0.5)',
    }),[]);

    const {data: config} = useQuery(rootApiService.getConfig());

    const downloadUrl = config?.backendUrl + value;

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