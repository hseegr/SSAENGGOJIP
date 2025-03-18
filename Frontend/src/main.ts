import {createApp} from 'vue'

import '@mdi/font/css/materialdesignicons.css'
import '@/assets/scss/common.scss'
import 'vuetify/styles'

import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import colors from 'vuetify/util/colors'
import {VDateInput} from "vuetify/labs/components";

import {createPinia} from "pinia"

import App from './App.vue'
import router from './router'
import axios from "@/api/axios.ts";


const vuetify = createVuetify({
    components: {...components, VDateInput},
    directives,
    theme: {
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: colors.blue.base,
                    secondary: colors.blueGrey.base,
                    delete: colors.red.lighten1,
                    link: colors.blue.darken4,
                }
            },
        },
    },
})

let pinia = createPinia();

axios.initInterceptors(pinia);

createApp(App)
    .use(vuetify)
    .use(router)
    .use(pinia)
    .mount('#app')
