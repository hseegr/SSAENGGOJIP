import {
    createRouter,
    createWebHistory,
    NavigationGuardNext,
    RouteLocationNormalizedGeneric,
    RouteRecordRaw
} from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import {useUserStore} from "@/store/user.ts";
import MainLayout from "@/layouts/MainLayout.vue";

const requireAuth = (to: RouteLocationNormalizedGeneric,
                     from: RouteLocationNormalizedGeneric,
                     next: NavigationGuardNext) => {
    const userStore = useUserStore();
    if (userStore.isAuthenticated) {
        next();
    } else if (localStorage.getItem("accessToken")) {
        next({
            name: 'loading',
            query: {
                from: from.path,
                returnPath: to.path,
                returnQuery: JSON.stringify(to.query),
            }
        });
    } else {
        next({
            name: 'login',
            query: {
                from: from.path,
                returnPath: to.path,
                returnQuery: JSON.stringify(to.query),
            }
        });
    }
}

const checkAuth = (to: RouteLocationNormalizedGeneric,
                   from: RouteLocationNormalizedGeneric,
                   next: NavigationGuardNext) => {
    const userStore = useUserStore();
    if (userStore.isAuthenticated) {
        next();
    } else if (localStorage.getItem("accessToken")) {
        next({
            name: 'loading',
            query: {
                from: from.path,
                returnPath: to.path,
                returnQuery: JSON.stringify(to.query),
            }
        });
    } else {
        next();
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/main',
    },
    {
        path: '/main',
        name: 'mainLayout',
        component: MainLayout,
        beforeEnter: checkAuth,
    },
    {
        path: '/admin',
        name: 'adminLayout',
        redirect: '/admin/home',
        component: AdminLayout,
        children: [
            {
                path: 'home',
                name: 'adminHome',
                component: () => import('@/view/admin/Home.vue'),
            },
            {
                path: 'user',
                name: 'userList',
                component: () => import('@/view/admin/user/UserList.vue')
            },
            {
                path: 'role',
                name: 'roleList',
                component: () => import('@/view/admin/role/RoleList.vue')
            },
            {
                path: 'role/view/:roleId?',
                name: 'roleView',
                component: () => import('@/view/admin/role/RoleView.vue')
            },
            {
                path: 'board/:bbsId',
                name: 'boardList',
                component: () => import('@/view/admin/board/BoardList.vue')
            },
            {
                path: 'board/:bbsId/view/:boardId',
                name: 'boardView',
                component: () => import('@/view/admin/board/BoardView.vue')
            },
            {
                path: 'board/:bbsId/write/:boardId?',
                name: 'boardWrite',
                component: () => import('@/view/admin/board/BoardWrite.vue')
            },
            {
                path: 'example/mattermost',
                name: 'mattermost',
                component: () => import('@/view/admin/example/Mattermost.vue')
            },
            {
                path: 'system/error',
                name: 'errorList',
                component: () => import('@/view/admin/system/error/ErrorList.vue')
            },
            {
                path: 'system/error/view/:errorId',
                name: 'errorView',
                component: () => import('@/view/admin/system/error/ErrorView.vue')
            },
            {
                path: 'system/ip-allowlist',
                name: 'ipAllowlist',
                component: () => import('@/view/admin/system/ip-allowlist/IpAllowlist.vue')
            },
        ],
        beforeEnter: requireAuth,
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/view/common/Login.vue'),
    },
    {
        path: '/loading',
        name: 'loading',
        component: () => import('@/view/common/Loading.vue'),
    },
    {
        path: '/sso/providers/:provider?/callback',
        name: 'ssoCallback',
        component: () => import('@/view/common/SsoCallback.vue'),
    }

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
