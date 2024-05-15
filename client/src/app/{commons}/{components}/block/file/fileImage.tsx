import Image from "next/image";
import {CSSProperties} from "react";

export default function FileImage({
    value
}: {
    value: string
}){

    const style: CSSProperties = {
        width: '100%',
    }


    return (
        <div style={style}>
            <Image src={value} width={700} height={700} alt={''}/>
        </div>
    )

}