import {useHotkeys} from 'react-hotkeys-hook';
import {RefObject} from 'react';
import {Category} from "@/app/board/{services}/types";
import {Options} from "react-hotkeys-hook/src/types";
import {RoleType} from "@/app/user/system/{services}/types";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export const useRootHotKey = ({
  searchRef,
}:{
  searchRef: RefObject<HTMLInputElement>,
}) => {
  useHotkeys('shift+f',(e, v)=>{
    e.preventDefault();

    if(searchRef.current) {
      searchRef.current.focus();
    }
  })
};


export const useRootLeftMenuHotKey = ({
  router,
  roles,
  boardBaseUrl,
  confirmRole,
  onChangeParamsHandler,
}:{
  boardBaseUrl: string,
  roles: RoleType[],
  router: AppRouterInstance,
  confirmRole: (item: { roles: RoleType[] }) => RoleType | undefined
  onChangeParamsHandler: ({type, value}: {type: string, value: string | number | boolean}) => void,
}) => {

  const hotkeysOption: Options = {
    preventDefault: true,
    enableOnFormTags: false,
  }

  useHotkeys(['0','9'], (_, handler) => {
    if(roles.length === 0) return;
    switch(handler.keys?.join('')) {
      case '0':
        onChangeParamsHandler({type: 'isSelf', value: true})
        break;
      case '9':
        onChangeParamsHandler({type: 'isFavorite', value: true})
        break;
    }
  }, hotkeysOption);

  useHotkeys(['shift+o', 'shift+l', 'shift+i'], (e, handler) => {
    if(roles.length === 0) return;
    switch(handler.keys?.join('')) {
      case 'o':
        router.push('/api/logout');
        break;
      case 'l':
        router.push('/login');
        break;
      case 'i':
        router.push('/user');
        break;
    }
  }, hotkeysOption, [roles]);

  useHotkeys(['shift+1', 'shift+2', 'shift+3', 'shift+4', 'shift+5'], (e, handler)=> {
    if(roles.length === 0) return;
    const selCate = Category.findById(handler.keys!.join(''))!;
    if(!confirmRole(selCate)) return;
    router.push(boardBaseUrl + selCate.id);
  }, hotkeysOption,[roles]);
  
}