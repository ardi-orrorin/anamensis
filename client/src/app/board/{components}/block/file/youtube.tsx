import {useState} from "react";
import {ExpendBlockProps} from "@/app/board/{components}/block/type/Types";

export type YoutubeBlockProps = {
    width: string;
    height: string;
}

type VideoRatio = {
    name: string;
    width : number;
    height: number;
}
const YoutubeBlock = (props: ExpendBlockProps) => {
    const {
        value, hash,
        type, isView,
        blockRef,
        onChangeValueHandler,
        onChangeExtraValueHandler
    } = props;

    const extraValue = props.extraValue as YoutubeBlockProps;
    const [ratio, setRatio] = useState<VideoRatio>({
        name: '16:9',
        width: 16,
        height: 9
    });

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.name === 'value') {
            const url = e.target.value.replaceAll('"', '');
            onChangeValueHandler!(url);
        }
        if(e.target.name === 'width') {
            const height = Math.trunc(Number(e.target.value) / ratio.width * ratio.height);

            onChangeExtraValueHandler!({width: e.target.value, height});
        }

        if(e.target.name === 'height') {
            const width =  Math.trunc(Number(e.target.value) / ratio.height * ratio.width);

            onChangeExtraValueHandler!({width, height: e.target.value});
        }
    }
    const onChangeSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [width,  height] = e.target.value.split(':')
            .map(value => Number(value));

        setRatio({
            name: e.target.value,
            width,
            height,
        });

        if(!extraValue?.width || !extraValue?.height) return;

        onChangeExtraValueHandler!({
            width: extraValue.width,
            height: String(Math.trunc(Number(extraValue.width) / width * height)),
        })
    }

    return (
        <div id={`block-${hash}`}
             className={'w-full overflow-x-auto'}
             aria-roledescription={type}
        >
            {
                !isView
                && <div className={'flex flex-col gap-3 p-4'}
                        style={{backgroundColor: isView ? '' : 'rgba(230,230,230,0.2)'}}
                >
                    <input className={'w-full p-1 outline-0'}
                           name={'value'}
                           value={value}
                           placeholder={'url 주소 ex) https://www.youtube.com/embed/~~~'}
                           onChange={onChangeHandler}
                           ref={el => {blockRef!.current[props.seq] = el}}
                    />
                    <div className={'flex'}>
                        <input className={'w-1/3 p-1 outline-0'}
                               name={'width'}
                               value={extraValue?.width}
                               onChange={onChangeHandler}
                               placeholder={'width'}
                        />
                        <input className={'w-1/3 p-1 outline-0'}
                               name={'height'}
                               value={extraValue?.height}
                               onChange={onChangeHandler}
                               placeholder={'height'}
                        />
                        <select className={'w-1/3 p-1 outline-0'}
                                value={ratio.name}
                                onChange={onChangeSelectHandler}
                        >
                            <option value={'4:3'}>4:3</option>
                            <option value={'16:9'}>16:9</option>
                            <option value={'16:10'}>16:10</option>
                        </select>
                    </div>
              </div>
            }
            {
                value
                && <div className={'py-2'}>
                    <iframe width={extraValue?.width ?? '560'}
                            height={extraValue?.height ?? '315 '}
                            src={value ?? ''}
                            title="YouTube video player" frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
                    </iframe>
                </div>
            }
        </div>
    )
}

export default YoutubeBlock;