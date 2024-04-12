export default function Page() {
  return (
      <main className={'flex flex-col min-h-screen justify-center items-center'}>
          <div className={"flex flex-col gap-4 border border-solid b border-blue-300 rounded w-1/2 pb-5"}>
              <div className={'flex flex-col gap-1 bg-blue-300 py-4'}>
                  <h1 className={'flex justify-center font-bold text-white text-xl'}
                  >Anamensis</h1>
                  <h3 className={'flex justify-center font-bold text-white text-base'}
                  >LOGIN</h3>
              </div>
              <div className={'flex flex-col gap-6 px-2'}>
                  <div className={'flex justify-between'}>
                      <input className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded p-2'}
                             placeholder={'아이디를 입력하세요.'}/>
                  </div>
                  <div className={'flex justify-between'}>
                      <input className={'w-full border border-none outline-0 focus:bg-blue-100 duration-300 text-xs rounded p-2'}
                             placeholder={'비밀번호를 입력하세요.'}/>
                  </div>
                  <div>
                      <button className={'w-full rounded bg-blue-300 hover:bg-blue-600 duration-300 text-xs text-white p-2'}
                      >로그인</button>
                  </div>
              </div>
              <div className={'flex justify-between px-3'}>
                  <a href={'#'}
                     className={'flex justify-center text-xs text-blue-300'}
                  >아이디 찾기</a>
                  <a href={'#'}
                     className={'flex justify-center text-xs text-blue-300'}
                  >회원 가입</a>
                  <a href={'#'}
                     className={'flex justify-center text-xs text-blue-300'}
                  >비밀번호 찾기</a>
              </div>
          </div>
      </main>
  );
}
