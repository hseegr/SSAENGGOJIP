import {defineStore} from "pinia";
import {getDetail, UserSummaryForAuthentication} from "@/api/user/UserApi.ts";
import {computed} from "vue";

export const useUserStore = defineStore("user", {
    state() {
        return {
            userInfo: <UserSummaryForAuthentication | undefined>undefined,
        };
    },
    getters: {
        isAuthenticated(): boolean {
            return !!this.userInfo;
        }
    },
    actions: {
        async fetchUserInfo() {
            try {
                let userInfo = await getDetail();
                this.userInfo = userInfo;
            } catch (error) {
                localStorage.removeItem("accessToken");
                this.userInfo = undefined;
            }
        },
        logout() {
            localStorage.removeItem("accessToken");
            this.userInfo = undefined;
        },
        hasRole(...targetRoles: string[]) {
            return computed(() => !!this.userInfo?.roles.some(role => targetRoles.includes(role)));
        }
    },
});
