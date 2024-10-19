'use client';

import {usePrefetchQuery} from "@tanstack/react-query";
import systemApiServices from "@/app/system/{services}/apiServices";

export default function Page() {

    usePrefetchQuery(systemApiServices.getSystemConfig());

    return (
        <>
            sdfs
        </>
    )
}