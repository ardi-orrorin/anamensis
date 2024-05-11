'use client'
import React, {useRef, useState} from "react";
import {InputH5, InputH4, InputH2, InputH3, InputH1} from "@/app/{components}/block/input/InputStyle";

export default function Page(){
    const [isView, setIsView] = useState(false);

    const ref = useRef<HTMLDivElement[]>([]);
    return (
        <div>
            <button onClick={()=>setIsView(!isView)}>Toggle View</button>
            <InputH5 seq={0}
                      code={'00001'}
                      color={''}
                      bg={''}
                      text={''}
                      size={''}
                      isView={isView}
                      openMenu={true}
                      openMenuToggle={()=>{}}
                      onChangeHandler={()=>{}}
                      onKeyUpHandler={()=>{}}
                      onKeyDownHandler={()=>{}}
                      onClickAddHandler={()=>{}}
                      value={'asdf한글자 두 글자 12345 1 2 3 4 ^ % $ # @ !'}
                      setValue={()=>{}}
                      blockRef={ref}
            />
            <InputH4 seq={0}
                      code={'00001'}
                      color={''}
                      bg={''}
                      text={''}
                      size={''}
                      isView={isView}
                      openMenu={true}
                      openMenuToggle={()=>{}}
                      onChangeHandler={()=>{}}
                      onKeyUpHandler={()=>{}}
                      onKeyDownHandler={()=>{}}
                      onClickAddHandler={()=>{}}
                      value={'asdf한글자 두 글자 12345 1 2 3 4 ^ % $ # @ !'}
                      setValue={()=>{}}
                      blockRef={ref}
            />
            <InputH3 seq={0}
                      code={'00001'}
                      color={''}
                      bg={''}
                      text={''}
                      size={''}
                      isView={isView}
                      openMenu={true}
                      openMenuToggle={()=>{}}
                      onChangeHandler={()=>{}}
                      onKeyUpHandler={()=>{}}
                      onKeyDownHandler={()=>{}}
                      onClickAddHandler={()=>{}}
                      value={'asdf한글자 두 글자 12345 1 2 3 4 ^ % $ # @ !'}
                      setValue={()=>{}}
                      blockRef={ref}
            />
            <InputH2 seq={0}
                      code={'00001'}
                      color={''}
                      bg={''}
                      text={''}
                      size={''}
                      isView={isView}
                      openMenu={true}
                      openMenuToggle={()=>{}}
                      onChangeHandler={()=>{}}
                      onKeyUpHandler={()=>{}}
                      onKeyDownHandler={()=>{}}
                      onClickAddHandler={()=>{}}
                      value={'asdf한글자 두 글자 12345 1 2 3 4 ^ % $ # @ !'}
                      setValue={()=>{}}
                      blockRef={ref}
            />
            <InputH1 seq={0}
                      code={'00001'}
                      color={''}
                      bg={''}
                      text={''}
                      size={''}
                      isView={isView}
                      openMenu={true}
                      openMenuToggle={()=>{}}
                      onChangeHandler={()=>{}}
                      onKeyUpHandler={()=>{}}
                      onKeyDownHandler={()=>{}}
                      onClickAddHandler={()=>{}}
                      value={'asdf한글자 두 글자 12345 1 2 3 4 ^ % $ # @ !'}
                      setValue={()=>{}}
                      blockRef={ref}
            />
        </div>
    )
}