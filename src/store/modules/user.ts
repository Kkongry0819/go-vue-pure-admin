import { defineStore } from "pinia";
import axios from "axios";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import { type DataInfo, setToken, removeToken, userKey } from "@/utils/auth";
import { useMultiTagsStoreHook } from "./multiTags";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 头像
    avatar: storageLocal().getItem<DataInfo<number>>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<DataInfo<number>>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<DataInfo<number>>(userKey)?.nickname ?? "",
    // 页面级别权限
    roles: storageLocal().getItem<DataInfo<number>>(userKey)?.roles ?? [],
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
  async loginByUsername(data) {
  try {
    const response = await axios.post('http://127.0.0.1:8848/api/login', data); // 假设登录API的端点是'/api/login'
    
    if (response.data.success) {
      console.log('传递给 setToken 的 data:', response.data);
      setToken(response.data);
    }
    
    return response.data;
  } catch (error) {
    // 这里可以根据错误类型做更详细的处理
    throw error; // 重新抛出错误，外部可以使用try...catch捕获
  }
},

    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      try {
        const response = await axios.post("/refresh-token", data);
        if (response.data) {
          setToken(response.data.data);
          return response.data;
        }
      } catch (error) {
        throw error;
      }
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
