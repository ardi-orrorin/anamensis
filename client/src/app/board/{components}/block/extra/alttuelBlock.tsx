import {BlockProps, FileContentType} from "@/app/board/{components}/block/type/Types";
import {ChangeEvent, CSSProperties, useContext, useMemo, useRef, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import TempFileProvider from "@/app/board/{services}/TempFileProvider";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";


type AlttuelBlockProps = {
    img           : string;
    url           : string;
    price         : number;
    discountCode  : string;
    deliveryFee   : number;
}

const AlttuelBlock = (props: BlockProps) => {

    const {
        hash, value
        , onChangeExtraValueHandler
        , isView
    }: BlockProps = props;
    const extraValue = props.extraValue as AlttuelBlockProps;
    const {setWaitUploadFiles} = useContext(TempFileProvider);

    const imageRef = useRef<HTMLInputElement>(null);
    const [imgLoading, setImgLoading] = useState<boolean>(false);
    const [imgModal, setImgModal] = useState<boolean>(false);
    const [viewImg, setViewImg] = useState<boolean>(false);

    const thumb = useMemo(()=>{
        return extraValue?.img
            ? process.env.NEXT_PUBLIC_CDN_SERVER + extraValue.img.replace(/(\.[^.]+)$/, '_thumb$1')
            : '/noimage.jpg';
    }, [extraValue?.img])

    const oriImg = useMemo(()=>{
        return extraValue?.img
            ? process.env.NEXT_PUBLIC_CDN_SERVER + extraValue.img
            : '/noimage.jpg';
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
        if(file.size > 1024 * 1024 * 5) return alert('5MB 이하의 파일만 업로드 가능합니다.');

        const fileContent: FileContentType = {
            tableCodePk: 2,
            categoryPk: 4,
        }

        const blob = new Blob([JSON.stringify(fileContent)], {type: 'application/json'})
        const formData = new FormData();

        formData.append('file', file);
        formData.append('fileContent', blob);

        setImgLoading(true);

        await axios.post('/api/file/img', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            if(!res.data) return ;
            setWaitUploadFiles(prevState => [
                ...prevState,
                {...res.data}
            ]);

            const url = res.data.filePath + res.data.fileName;

            if(!onChangeExtraValueHandler) return;
            onChangeExtraValueHandler({...extraValue, img: url});
        }).finally(() => {
            setImgLoading(false);
        });
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target;

        if(name === 'title') {
            if(!props.onChangeValueHandler) return;
            props.onChangeValueHandler(value);
            return;
        }
        const newValue = {...extraValue, [name]: value};

        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler(newValue);

        // onChangeExtraValueHandler()
    }

    const onImgOriginalClickHandler = () => {
        if(!extraValue?.img) return;
        window.open(process.env.NEXT_PUBLIC_CDN_SERVER + extraValue.img);
    }

    const containerStyle: CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
        border: 'none',
        outline: 'none',
        wordBreak: 'break-all',
        padding: '1rem',
        backgroundColor: isView ? '' : 'rgba(230,230,230,0.2)',
    }

    return (
        <div id={`block-${hash}`}
             className={'w-full'}
             aria-roledescription={'object'}
        >
            <div style={containerStyle}>
                {
                    isView
                    ? <div style={{position: 'relative'}}>
                        <Image style={imageStyle}
                               width={100}
                               height={100}
                               src={thumb}
                               alt={'대표 이미지'}
                               onMouseEnter={()=> setImgModal(true)}
                        />
                        {
                            imgModal
                            && <div style={isViewModalStyle}
                                    onMouseLeave={()=> setImgModal(false)}
                                    onClick={() => setViewImg(true)}
                          >
                                큰 이미지 보기
                            </div>
                        }
                        {
                            viewImg
                            && <div style={originImgStyle}>
                                <Image src={oriImg}
                                       alt={'원본 이미지'}
                                       width={700}
                                       height={700}
                                       onClick={() => setViewImg(false)}
                                />
                            </div>

                        }
                    </div>

                    : <div style={{position: 'relative'}}>
                        <img style={imageStyle}
                           src={thumb}
                           alt={'대표 이미지'}
                           onClick={onChangeImageHandler}
                        />
                        {
                            imgLoading
                            && <div style={loadingStyle}>
                                <LoadingSpinner size={20}/>
                            </div>
                        }
                    </div>
                }
                {
                    !isView
                    && <input ref={imageRef}
                              type={'file'}
                              multiple={false}
                              accept={'image/*'}
                              hidden={true}
                              disabled={isView || imgLoading}
                              onChange={onChangeFileHandler}
                    />
                }

                <div style={infoContainerStyle}>
                    {
                        isView
                        ? <p style={{...viewCommonPTagStyle , ...titleStyle}}>
                            상품명 : &nbsp; {value}
                        </p>
                        : <input style={inputCommonStyle}
                                 name={'title'}
                                 value={value}
                                 placeholder={'상품 이름'}
                                 onChange={onChangeHandler}
                        />
                    }
                    {
                        isView
                        ? <Link style={{...viewCommonPTagStyle, ...linkStyle}}
                                href={'https://www.naver.com'}>
                            링크 : &nbsp; {extraValue?.url ?? '주소없음' }
                        </Link>
                        : <input style={inputCommonStyle}
                                 name={'url'}
                                 value={extraValue?.url ?? ''}
                                 onChange={onChangeHandler}
                                 placeholder={'url 주소를 입력하세요 (ex: https://www.naver.com)'}
                        />
                    }

                    <div style={infoDetailContainerStyle}>
                        {
                            isView
                            ? <p style={{...viewCommonPTagStyle, ...moneyStyle}}>
                                가격 : &nbsp; {addCommasToNumber(extraValue?.price ?? 0)}
                            </p>
                            : <input style={inputCommonStyle}
                                     type={'number'}
                                     name={'price'}
                                     value={extraValue?.price ?? 0}
                                     onChange={onChangeHandler}
                                     placeholder={'금액'}
                            />
                        }
                        {
                            isView
                            ? <p style={{...viewCommonPTagStyle, ...feeStyle}}>
                                할인코드 : &nbsp; {extraValue?.discountCode ?? 0}
                            </p>
                            : <input style={inputCommonStyle}
                                     name={'discountCode'}
                                     value={extraValue?.discountCode ?? 0}
                                     onChange={onChangeHandler}
                                     placeholder={'할인코드'}
                            />
                        }
                        {
                            isView
                            ? <p style={{...viewCommonPTagStyle, ...feeStyle}}>
                                배송비 : &nbsp; {addCommasToNumber(extraValue?.deliveryFee ?? 0)}
                            </p>
                            : <input style={inputCommonStyle}
                                     type={'number'}
                                     name={'deliveryFee'}
                                     value={extraValue?.deliveryFee ?? 0}
                                     onChange={onChangeHandler}
                                     placeholder={'배송비'}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};





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
    width: '100px',
    minWidth: '100px',
    height: '100px',
    minHeight: '100px',
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
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 99,
    width: 600,
    height: 600,
    padding: '0.6rem',
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid rgba(100,100,100,0.2)',
    animation: 'fadeIn 0.5s',
    boxShadow: '0 0 10px rgba(0,0,0,0.2)',
}

export default AlttuelBlock;