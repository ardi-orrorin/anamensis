import HotKeybtn from "@/app/{components}/hotKeybtn";

const HotKeyInfo = ({
    isNewBoard,
    isView,
} : {
    isNewBoard: boolean
    isView: boolean
}) => {
    return (
        <div className={'flex flex-col w-48 px-2 py-4 text-xs shadow rounded  bg-gray-50'}>
            <h1 className={'flex justify-center p-2'}>
                단축키
            </h1>
            <ul className={'w-full flex flex-col gap-2 justify-center items-center'}>
                <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                    <span>
                        너비 변경 :
                    </span>
                    <HotKeybtn hotkey={['SHIFT', 'F']} />
                </li>
                {
                    (isNewBoard || !isView)
                    && <>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            h1블록 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', '1']} />
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            h2블록 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', '2']} />
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            h3블록 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', '3']} />
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            h4블록 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', '4']} />
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            h5블록 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', '5']} />
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            인용 블록:
                        </span>
                        <HotKeybtn hotkey={['CTRL', '6']} />
                    </li>
                    <li className={'w-full px-5 py-2 justify-center flex items-center'}>
                      폰트 스타일
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            굵게 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', 'B']} />
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>n dev

                            이탤릭체 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', 'I']} />
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            취소선 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', ';']} />
                    </li>
                    <li className={'w-full px-5 justify-between flex gap-2 items-center'}>
                        <span>
                            초기화 :
                        </span>
                        <HotKeybtn hotkey={['CTRL', '/']} />
                    </li>
                  </>
                }
            </ul>
        </div>
    )
}

export default HotKeyInfo;