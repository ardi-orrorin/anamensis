'use client';
import FileBlock from "@/app/{commons}/{components}/block/file/fileBlock";
import {useEffect} from "react";
import axios from "axios";

export default function Page () {

    useEffect(() => {
        return () => {
            console.log('Page unMount');
            axios.get('/api/test1');
        }
    },[]);

    return (
        <div>
            <FileBlock seq={1}
                       value={''}
                       code={'00007'}
            />
            <FileBlock seq={1}
                       value={''}
                       code={'000010'}
            />
        </div>
    )
}