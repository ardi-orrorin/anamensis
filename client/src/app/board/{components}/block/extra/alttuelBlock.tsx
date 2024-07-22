import {ExpendBlockProps, FileContentType} from "@/app/board/{components}/block/type/Types";
import React, {ChangeEvent, useContext, useEffect, useMemo, useRef, useState} from "react";
import Image from "next/image";
import axios from "axios";
import TempFileProvider from "@/app/board/{services}/TempFileProvider";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";
import {defaultNoImg} from "@/app/{commons}/func/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faXmark} from "@fortawesome/free-solid-svg-icons/faXmark";
import apiCall from "@/app/{commons}/func/api";
import {NO_IMAGE} from "@/app/{services}/constants";


export type AlttuelBlockProps = {
    img           : string;
    url           : string;
    price         : number;
    discountCode  : string;
    deliveryFee   : number;
    tags?         : string[];
}

type ImgViewProps = {
    imgLoading : boolean;
    imgModal   : boolean;
    viewImg    : boolean;
}

const AlttuelBlock = (props: ExpendBlockProps) => {
    const {
        hash, value
        , onChangeExtraValueHandler
        , isView, type
    }: ExpendBlockProps = props;

    const maxFileSize = 5 * 1024 * 1024;

    const extraValue = props.extraValue as AlttuelBlockProps;
    const {setWaitUploadFiles, setWaitRemoveFiles} = useContext(TempFileProvider);

    const imageRef = useRef<HTMLInputElement>(null);
    const [imgViewProps, setImgViewProps] = useState<ImgViewProps>({
        imgLoading: false,
        imgModal: false,
        viewImg: false,
    } as ImgViewProps);

    useEffect(() => {
        if(!extraValue) {
            if(!onChangeExtraValueHandler) return;
            onChangeExtraValueHandler({
                url: 'https://',
                tags: [],
            });
        }
    },[]);

    const thumb = useMemo(()=>{
        return defaultNoImg(extraValue?.img?.replace(/(\.[^.]+)$/, '_thumb$1'));
    }, [extraValue?.img])

    const oriImg = useMemo(()=>{
        return defaultNoImg(extraValue?.img);
    }, [extraValue?.img])

    const addCommasToNumber = (number: number)  => {
        if(Number(number) === 0) return '무료';
        const money = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return `${money}원`;
    }

    const onChangeImageHandler = () => {
        if(!imageRef.current) return;
        imageRef.current.click();
    }

    const onChangeFileHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        if(!e.target.files) return;

        const file = e.target.files[0];

        await uploadImage(file);
    }

    const uploadImage = async (file: File) => {
        if(!file) return ;
        if(file.size > maxFileSize) return alert('5MB 이하의 파일만 업로드 가능합니다.');

        const fileContent: FileContentType = {
            tableCodePk: 2,
            categoryPk: 4,
        }

        const blob = new Blob([JSON.stringify(fileContent)], {type: 'application/json'})
        const formData = new FormData();

        formData.append('file', file);
        formData.append('fileContent', blob);

        setImgViewProps(prevState => ({
            ...prevState,
            imgLoading: true,
        }));

        try {
            const res = await axios.post('/api/file/img', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if(!res.data) return ;

            if(extraValue?.img) {
                const filename = extraValue.img.substring(extraValue.img.lastIndexOf('/') + 1);

                await apiCall({
                    path: '/api/file/delete/filename',
                    method: 'PUT',
                    body: {fileUri: extraValue.img},
                    isReturnData: false,
                })
                .then(() => {
                    setWaitRemoveFiles(prevState =>
                        [...prevState.filter(file => file.fileName !== filename)]
                    );
                })

            } else {
                setWaitUploadFiles(prevState => [
                    ...prevState,
                    {...res.data}
                ]);
            }

            const url = res.data.filePath + res.data.fileName;

            if(!onChangeExtraValueHandler) return;
            onChangeExtraValueHandler({...extraValue, img: url});

        } catch (e) {
            console.error(e);
        } finally {
            setImgViewProps(prevState => ({
                ...prevState,
                imgLoading: false,
            }));
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target;

        if(name === 'title') {
            if(!props.onChangeValueHandler) return;
            props.onChangeValueHandler(value);
            return;
        }


        const condition = value.startsWith('0') && value !== '0';
        const money = condition ? value.replace(/^0+/, '') : value;

        const newValue = {...extraValue, [name]: money};

        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler(newValue);
    }

    const addTagHandler = (e:  React.KeyboardEvent<HTMLInputElement>) => {
        if(e.code !== 'Space') return;
        if(e.nativeEvent.isComposing) return;
        if(e.currentTarget.value.trim().length <= 2) {
            e.currentTarget.value = ''
            return;
        }

        if(extraValue!.tags!.length >= 3) {
            return alert('태그는 최대 3개까지 가능합니다.');
        }

        const tagReg = /#[^\s]+/g;

        const tag = e.currentTarget.value.match(tagReg)?.[0];

        if(!tag) return;
        if(!onChangeExtraValueHandler) return;
        const tags = Array.from(new Set(extraValue?.tags ?? []).add(tag));

        const newValue = {...extraValue, tags};

        onChangeExtraValueHandler(newValue);

        if(tag) e.currentTarget.value = '';
    }

    const deleteTagHandler = (tag: string) => {
        if(!onChangeExtraValueHandler) return;
        const tags = extraValue?.tags?.filter(t => t !== tag);

        const newValue = {...extraValue, tags} as AlttuelBlockProps;

        onChangeExtraValueHandler(newValue);
    }

    const tags = useMemo(() =>
        Array.from(extraValue?.tags ?? [])
            .map((tag, index) =>
                <Tag key={index}
                     {...{tag, deleteTagHandler, isView: isView!}}
                />
            )
    ,[extraValue?.tags, isView])


    return (
        <div id={`block-${hash}`}
             className={'w-full'}
             aria-roledescription={type}
             ref={el => {
                 if(!props.blockRef?.current) return ;
                 props!.blockRef!.current[props.seq] = el
            }}
        >
            <div className={[
                'flex flex-col sm:flex-row w-full items-center gap-4 outline-0 break-all',
                isView || 'p-4',
            ].join(' ')}
                 style={{backgroundColor: isView ? '' : 'rgba(230,230,230,0.2)'}}
            >
               <ImageThumb {...{thumb, extraValue, imgViewProps, oriImg, imageRef,
                   setImgViewProps, onChangeImageHandler, onChangeFileHandler, isView: isView!}}
               />
               <div className={'flex flex-col gap-2 w-full sm:pl-4 sm:border-l sm:border-solid sm:border-gray-300'}>
                    <Title {...{value, onChangeHandler, isView: isView!}} />
                    <SiteLink {...{extraValue, onChangeHandler, isView: isView!}} />
                    <div className={'flex gap-2'}>
                        <Price {...{extraValue, onChangeHandler, addCommasToNumber, isView: isView!}} />
                        <DiscountCode {...{extraValue, onChangeHandler, isView: isView!}} />
                        <DeliveryFee {...{extraValue, onChangeHandler, addCommasToNumber, isView: isView!}} />
                    </div>
                    <div className={'flex flex-col w-full'}>
                        {
                            !isView
                            && <input className={'w-full break-all text-sm px-2 py-1 outline-0'}
                                      placeholder={'최소 2글자, 태그 최대 3개 가능'}
                                      onKeyUp={addTagHandler}
                            />
                        }
                        {
                            extraValue
                            && extraValue?.tags
                            && extraValue?.tags?.length > 0
                            && <div className={'flex py-2 gap-2 text-sm text-blue-700'}>
                                { tags }
                          </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const DeliveryFee = ({
    isView,
    extraValue,
    onChangeHandler,
    addCommasToNumber,
} : {
    isView: boolean,
    extraValue: AlttuelBlockProps,
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void,
    addCommasToNumber: (number: number) => string,
}) => {
    if(isView) return (
        <p className={'w-full p-1 text-md break-all text-sm text-gray-800 font-light'}>
            배송비 : &nbsp; {addCommasToNumber(extraValue?.deliveryFee ?? 0)}
        </p>
    )

    return (
        <input className={'w-full break-all text-sm px-2 py-1 outline-0'}
               type={'number'}
               name={'deliveryFee'}
               value={extraValue?.deliveryFee ?? 0}
               onChange={onChangeHandler}
               placeholder={'배송비'}
        />
    )
}

const DiscountCode = ({
    isView,
    extraValue,
    onChangeHandler,
} : {
    isView: boolean,
    extraValue: AlttuelBlockProps,
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void,
}) => {
    if(isView) return (
        <p className={'w-full p-1 text-md break-all text-sm text-gray-800 font-light'}>
            할인코드 : &nbsp; {extraValue?.discountCode ?? ''}
        </p>
    )

    return (
        <input className={'w-full break-all text-sm px-2 py-1 outline-0'}
               name={'discountCode'}
               value={extraValue?.discountCode ?? ''}
               onChange={onChangeHandler}
               placeholder={'할인코드'}
        />
    )
}


const Price = ({
    isView,
    extraValue,
    onChangeHandler,
    addCommasToNumber,
}: {
    isView: boolean,
    extraValue: AlttuelBlockProps,
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void,
    addCommasToNumber: (number: number) => string,
}) => {

    if(isView) return (
        <p className={'w-full p-1 text-md break-all text-sm text-red-600 font-bold'}>
            가격 : &nbsp; {addCommasToNumber(extraValue?.price ?? 0)}
        </p>
    )

    return (
        <input className={'w-full break-all text-sm px-2 py-1 outline-0'}
               type={'number'}
               name={'price'}
               value={extraValue?.price ?? 0}
               onChange={onChangeHandler}
               placeholder={'금액'}
        />
    )
}


const SiteLink = ({
    isView,
    extraValue,
    onChangeHandler,
} : {
    isView: boolean,
    extraValue: AlttuelBlockProps,
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void,
}) => {
    if(isView) return (
        <a className={'w-full p-1 text-md break-all text-blue-700'}
           href={extraValue?.url ?? ''}
           target={'_blank'}
        >
            링크 : &nbsp; {extraValue?.url ?? '주소없음' }
        </a>
    )
    return (
        <input className={'w-full break-all text-sm px-2 py-1 outline-0'}
               name={'url'}
               value={extraValue?.url ?? ''}
               onChange={onChangeHandler}
               placeholder={'url 주소를 입력하세요 (ex: https://www.naver.com)'}
        />
    )
}

const Title = ({
    isView,
    value,
    onChangeHandler,
}: {
    isView: boolean,
    value: string,
    onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void,
}) => {

    if(isView) return (
        <p className={'w-full p-1 text-md break-all font-bold'}>
            상품명 : &nbsp; {value}
        </p>
    )

    return (
        <input className={'w-full break-all text-sm px-2 py-1 outline-0'}
               name={'title'}
               value={value}
               placeholder={'상품 이름'}
               onChange={onChangeHandler}
        />
    )

}

const ImageThumb = ({
    thumb,
    extraValue,
    setImgViewProps,
    imgViewProps,
    onChangeImageHandler,
    oriImg,
    isView,
    imageRef,
    onChangeFileHandler,
}: {
    oriImg: string,
    isView: boolean,
    thumb: string,
    extraValue: AlttuelBlockProps,
    imgViewProps: ImgViewProps,
    imageRef: React.RefObject<HTMLInputElement>,
    onChangeImageHandler: () => void
    setImgViewProps: React.Dispatch<React.SetStateAction<ImgViewProps>>
    onChangeFileHandler: (e: ChangeEvent<HTMLInputElement>) => void,
}) => {

    if(!isView)
        return (
            <>
                <div className={'relative w-full sm:w-auto'}>
                    <img className={'w-full h-[200px] sm:w-[150px] sm:h-[150px] sm:min-w-[150px] sm:min-h-[150px] object-cover rounded'}
                         src={thumb}
                         alt={'대표 이미지'}
                         onClick={onChangeImageHandler}
                         onError={e => {
                             e.currentTarget.src = NO_IMAGE;
                         }}
                    />
                    {
                        imgViewProps.imgLoading
                        && <div className={'absolute z-10 flex justify-center items-center left-0 top-0 w-full h-full rounded bg-black bg-opacity-25'}>
                        <LoadingSpinner size={20}/>
                      </div>
                    }
                </div>
                <input ref={imageRef}
                       type={'file'}
                       multiple={false}
                       accept={'image/*'}
                       hidden={true}
                       disabled={isView || imgViewProps.imgLoading}
                       onChange={onChangeFileHandler}
                />
            </>
        )
    return (
        <>
            <div className={'relative w-full sm:w-auto duration-500'}>
                <Image className={'w-full h-[200px] sm:w-[150px] sm:h-[150px] sm:min-w-[150px] sm:min-h-[150px] object-cover rounded duration-500'}
                       width={150}
                       height={150}
                       src={thumb}
                       alt={'대표 이미지'}
                       onError={e => {
                           e.currentTarget.src = NO_IMAGE;
                       }}
                       onMouseEnter={()=> setImgViewProps(prevState => ({
                           ...prevState,
                           imgModal: true
                       }))}
                />
                {
                    extraValue?.img && imgViewProps.imgModal
                    && <div className={'absolute z-10 flex justify-center items-center top-0 left-0 w-full h-full text-sm text-white bg-opacity-40 bg-black rounded  duration-500'}
                            onMouseLeave={()=> setImgViewProps(prevState => ({
                                ...prevState,
                                imgModal: false
                            }))}
                            onClick={() => setImgViewProps(prevState => ({
                                ...prevState,
                                viewImg: true
                            }))}
                  >
                    큰 이미지 보기
                  </div>
                }
                {
                    imgViewProps.viewImg
                    && <div className={'fixed z-[99] w-full h-full flex justify-center items-center left-0 top-0 p-2 bg-gray-600 bg-opacity-40 duration-500'}
                            onClick={()=> setImgViewProps(prevState => ({
                                ...prevState,
                                viewImg: false
                            }))}
                    >
                    <Image src={oriImg}
                           alt={'원본 이미지'}
                           width={700}
                           height={700}
                           onClick={()=> setImgViewProps(prevState => ({
                               ...prevState,
                               viewImg: false
                           }))}
                           onError={e => {
                               e.currentTarget.src = NO_IMAGE;
                           }}
                    />
                  </div>
                }
            </div>
        </>
    )
}

const Tag = ({
    tag,
    isView,
    deleteTagHandler
} : {
    tag: string,
    isView: boolean,
    deleteTagHandler: (tag: string) => void
}) => {
    return (
        <button className={'flex px-2 items-center text-sm'}
                disabled={isView}
                onClick={()=> deleteTagHandler(tag)}
        >
            {tag}
            {
                !isView
                && <FontAwesomeIcon className={'text-sm'}
                                    icon={faXmark}
                />
            }
        </button>
    )

}

export default AlttuelBlock;