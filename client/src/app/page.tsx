// 'use client';

import axios from "axios";
// import {useEffect} from "react";

export default function Home() {

    const data = axios.get('./login/api')


  return (
      <main className={'flex flex-col min-h-screen justify-center items-center'}>
      </main>
  );
}
