import {ExpendBlockProps, FileContentType} from "@/app/board/{components}/block/type/Types";
import React, {ChangeEvent, CSSProperties, useContext, useEffect, useMemo, useRef, useState} from "react";
import Image from "next/image";
import Link from "next/link";
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


    return (
        <div id={`block-${hash}`}
             className={'w-full'}
             aria-roledescription={type}
             ref={el => {props!.blockRef!.current[props.seq] = el}}
        >
            <div style={containerStyle(isView ?? false)}>
               <ImageThumb {...{thumb, extraValue, imgViewProps, oriImg, imageRef,
                   setImgViewProps, onChangeImageHandler, onChangeFileHandler, isView: isView!}}
               />
                <div style={infoContainerStyle}>
                    <Title {...{value, onChangeHandler, isView: isView!}} />
                    <SiteLink {...{extraValue, onChangeHandler, isView: isView!}} />
                    <div style={infoDetailContainerStyle}>
                        <Price {...{extraValue, onChangeHandler, addCommasToNumber, isView: isView!}} />
                        <DiscountCode {...{extraValue, onChangeHandler, isView: isView!}} />
                        <DeliveryFee {...{extraValue, onChangeHandler, addCommasToNumber, isView: isView!}} />
                    </div>
                    <div style={tagsContainerStyle}>
                        {
                            extraValue
                            && extraValue?.tags
                            && extraValue?.tags?.length > 0
                            && <div style={tagsStyle}>
                                {
                                    Array.from(extraValue?.tags ?? [])
                                        .map((tag, index) =>
                                            <Tag key={index}
                                                 {...{tag, deleteTagHandler, isView: isView!}}
                                            />
                                        )
                                }
                          </div>
                        }

                        {
                            !isView
                            && <input style={inputCommonStyle}
                                      placeholder={'최소 2글자, 태그 최대 3개 가능'}
                                      onKeyUp={addTagHandler}
                            />
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
        <p style={{...viewCommonPTagStyle, ...feeStyle}}>
            배송비 : &nbsp; {addCommasToNumber(extraValue?.deliveryFee ?? 0)}
        </p>
    )

    return (
        <input style={inputCommonStyle}
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
        <p style={{...viewCommonPTagStyle, ...feeStyle}}>
            할인코드 : &nbsp; {extraValue?.discountCode ?? ''}
        </p>
    )

    return (
        <input style={inputCommonStyle}
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
        <p style={{...viewCommonPTagStyle, ...moneyStyle}}>
            가격 : &nbsp; {addCommasToNumber(extraValue?.price ?? 0)}
        </p>
    )

    return (
        <input style={inputCommonStyle}
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
        <Link style={{...viewCommonPTagStyle, ...linkStyle}}
              href={extraValue?.url ?? ''}>
            링크 : &nbsp; {extraValue?.url ?? '주소없음' }
        </Link>
    )
    return (
        <input style={inputCommonStyle}
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
        <p style={{...viewCommonPTagStyle , ...titleStyle}}>
            상품명 : &nbsp; {value}
        </p>
    )

    return (
        <input style={inputCommonStyle}
               name={'title'}
               value={value}
               placeholder={'상품 이름'}
               onChange={onChangeHandler}
        />
    )

}

// todo: 이미지 삭제 로직 추가
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
                <div style={{position: 'relative'}}>
                    <img style={imageStyle}
                         src={defaultNoImg(thumb)}
                         alt={'대표 이미지'}
                         onClick={onChangeImageHandler}
                         onError={e => {
                             e.currentTarget.src = NO_IMAGE;
                         }}
                    />
                    {
                        imgViewProps.imgLoading
                        && <div style={loadingStyle}>
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
            <div style={{position: 'relative'}}>
                <Image style={imageStyle}
                       width={150}
                       height={150}
                       src={defaultNoImg(thumb)}
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
                    && <div style={isViewModalStyle}
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
                    && <div style={originImgStyle}>
                    <Image src={defaultNoImg(oriImg)}
                           alt={'원본 이미지'}
                           width={700}
                           height={700}
                           onClick={()=> setImgViewProps(prevState => ({
                               ...prevState,
                               viewImg: false
                           }))}
                           onMouseLeave={() => setImgViewProps(prevState => ({
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

const Tag = (
    props
: {
    tag: string,
    isView: boolean,
    deleteTagHandler: (tag: string) => void
}) => {
    const {tag, isView, deleteTagHandler} = props;
    return (
        <button style={tagStyle}
                disabled={isView}
                onClick={()=> deleteTagHandler(tag)}
        >
            {tag}
            {
                !isView && <FontAwesomeIcon icon={faXmark}/>
            }
        </button>
    )

}

const tagsContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '0.8rem',
    width: '100%',
}

const tagsStyle: CSSProperties = {
    display: 'flex',
    gap: '0.8rem',
    fontSize: '0.8rem',
}

const tagStyle: CSSProperties = {
    backgroundColor: 'gray',
    color: 'white',
    padding: '0.2rem 0.5rem',
    fontSize: '0.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    height: '1.5rem',
    lineHeight: '1.5rem',
    fontWeight: '600',
    letterSpacing: '0.03rem',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
}


const containerStyle = (isView: boolean) : CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    border: 'none',
    outline: 'none',
    wordBreak: 'break-all',
    padding: isView ? '' : '1rem',
    backgroundColor: isView ? '' : 'rgba(230,230,230,0.2)',
});

const infoContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    width: '100%',
    paddingLeft: '1rem',
    borderLeft: '1px solid rgba(100, 100, 100, 0.2)',
}

const infoDetailContainerStyle: CSSProperties = {
    display: 'flex',
    gap: '0.8rem',
    width: '100%',
}

const imageStyle: CSSProperties = {
    width: 150,
    minWidth: 150,
    height: 150,
    minHeight: 150,
    borderRadius: '0.5rem',
    objectFit: 'cover',
}

const inputCommonStyle: CSSProperties = {
    outline: 'none',
    border: 'none',
    width: '100%',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
    height: '1.5rem',
    padding: '0.5rem',
    letterSpacing: '0.03rem',
    fontSize: '0.9rem',
}

const viewCommonPTagStyle: CSSProperties = {
    width: '100%',
    height: '1.5rem',
    padding: '0.5rem',
    letterSpacing: '0.03rem',
    fontSize: '0.9rem',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
}

const titleStyle: CSSProperties = {
    fontWeight: '600',
}

const linkStyle: CSSProperties = {
    color: 'blue',
}

const moneyStyle: CSSProperties = {
    color: 'red',
    fontWeight: '700',
}

const feeStyle: CSSProperties = {
    color: 'gray',
    fontWeight: '400',
}

const loadingStyle: CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0.5rem',
}

const isViewModalStyle: CSSProperties = {
    borderRadius: '0.5rem',
    fontSize: '0.7rem',
    color: 'white',
    position: 'absolute',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const originImgStyle: CSSProperties = {
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 99,
    width: 700,
    height: 'auto',
    padding: '0.6rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid rgba(100,100,100,0.2)',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
}

export default AlttuelBlock;