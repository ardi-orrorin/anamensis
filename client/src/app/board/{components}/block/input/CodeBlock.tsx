import {BlockProps} from "@/app/board/{components}/block/type/Types";
import {Editor} from "@monaco-editor/react";
import {useEffect} from "react";
import LoadingSpinner from "@/app/{commons}/LoadingSpinner";

export type CodeExtraValueI = {
    language : string;
    line     : number;
    minimap  : 'on' | 'off';
    theme    : string;
}

const CodeBlock = (props: BlockProps & {type: string}) => {

    const {
        value, isView,
        hash, type,
        onChangeValueHandler, onChangeExtraValueHandler
    } = props

    const extraValue = props.extraValue as CodeExtraValueI;

    useEffect(()=>{
        if(extraValue?.language) return;
        if(!onChangeExtraValueHandler) return;
        onChangeExtraValueHandler({
            language: 'plaintext',
            line: 5,
            minimap: 'on',
            theme: 'light',
        } as CodeExtraValueI);

    },[])

    return (
        <div className={'w-full flex flex-col p-1 gap-2 bg-gray-100'}
             id={`block-${hash}`}
             aria-roledescription={type}
             ref={el => {
                 if(!props.blockRef?.current) return;
                 props!.blockRef!.current[props.seq] = el
             }}
        >
            {
                !isView
                && <div className={'w-full flex items-center gap-1 justify-end'}>
                    <select className={'w-32 h-7 px-2 rounded outline-0 bg-gray-200 text-sm'}
                            value={extraValue?.minimap || 'on'}
                            onChange={e => {
                                onChangeExtraValueHandler
                                && onChangeExtraValueHandler({...extraValue, minimap: e.target.value})
                            }}
                    >
                      <option value={'on'}>Minimap - On</option>
                      <option value={'off'}>Minimap - Off</option>
                    </select>
                    <select className={'w-32 h-7 px-2 rounded outline-0 bg-gray-200 text-sm'}
                            value={extraValue?.theme || 'light'}
                            onChange={e => {
                                onChangeExtraValueHandler
                                && onChangeExtraValueHandler({...extraValue, theme: e.target.value})
                            }}
                    >
                        <option value={'light'}>Light</option>
                        <option value={'vs-dark'}>Vs-Dark</option>
                    </select>
                    <input className={'w-20 h-7 px-3 rounded bg-gray-200 outline-0 text-sm'}
                           value={extraValue?.line}
                           onChange={e => {
                              onChangeExtraValueHandler
                              && onChangeExtraValueHandler({...extraValue, line: Number(e.target.value)})
                    }}/>
                    <select className={'w-32 h-7 px-2 rounded outline-0 bg-gray-200 text-sm'}
                            value={extraValue?.language || 'plaintext'}
                            onChange={e => {
                                onChangeExtraValueHandler
                                && onChangeExtraValueHandler({...extraValue, language: e.target.value})
                            }}>
                        {
                            languages.map((item, index) => {
                                return (
                                    <option key={'languages' + index} value={item}>{item}</option>
                                )
                            })
                        }
                    </select>
              </div>
            }
            <div className={'w-full'}
                 style={{height: (extraValue?.line || 1) * 18}}
            >
                <Editor defaultLanguage={'java'}
                        value={value}
                        onChange={e => onChangeValueHandler && onChangeValueHandler(e ?? '')}
                        loading={LoadingSpinner({size: 20})}
                        options={{
                            inlineSuggest: {
                                enabled: true,
                                mode: 'prefix',
                                fontFamily: 'default',
                                suppressSuggestions: true,
                                keepOnBlur: true
                            },
                            padding: {
                                top: 10,
                                bottom: 10
                            },
                            codeLens: true,
                            hover: {
                              enabled: true
                            },
                            wordWrap: 'on',
                            autoClosingBrackets: 'always',
                            minimap: {
                                enabled: extraValue?.minimap === 'on',
                            },
                            linkedEditing: true,
                            readOnly: isView,
                            contextmenu: !isView,
                            scrollBeyondLastLine: !isView,
                            autoDetectHighContrast: true
                        }}
                        theme={extraValue?.theme || 'light'}
                />
            </div>
        </div>
    )
}


const languages = [
    'plaintext'
    , 'abap'
    , 'apex'
    , 'azcli'
    , 'bat'
    , 'bicep'
    , 'cameligo'
    , 'clojure'
    , 'coffeescript'
    , 'c'
    , 'cpp'
    , 'csharp'
    , 'csp'
    , 'css'
    , 'cypher'
    , 'dart'
    , 'dockerfile'
    , 'ecl'
    , 'elixir'
    , 'flow9'
    , 'fsharp'
    , 'freemarker2'
    , 'go'
    , 'graphql'
    , 'handlebars'
    , 'hcl'
    , 'html'
    , 'ini'
    , 'java'
    , 'javascript'
    , 'julia'
    , 'kotlin'
    , 'less'
    , 'lexon'
    , 'lua'
    , 'liquid'
    , 'm3'
    , 'markdown'
    , 'mdx'
    , 'mips'
    , 'msdax'
    , 'mysql'
    , 'objective-c'
    , 'pascal'
    , 'pascaligo'
    , 'perl'
    , 'pgsql'
    , 'php'
    , 'pla'
    , 'postiats'
    , 'powerquery'
    , 'powershell'
    , 'proto'
    , 'pug'
    , 'python'
    , 'qsharp'
    , 'r'
    , 'razor'
    , 'redis'
    , 'redshift'
    , 'restructuredtext'
    , 'ruby'
    , 'rust'
    , 'sb'
    , 'scala'
    , 'scheme'
    , 'scss'
    , 'shell'
    , 'sol'
    , 'aes'
    , 'sparql'
    , 'sql'
    , 'st'
    , 'swift'
    , 'systemverilog'
    , 'verilog'
    , 'tcl'
    , 'twig'
    , 'typescript'
    , 'json'
    , 'typespec'
    , 'vb'
    , 'wgsl'
    , 'xml'
    , 'yaml'
]

export default CodeBlock;