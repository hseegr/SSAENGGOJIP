import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import { fileURLToPath } from "node:url";

const viteConfig = defineConfig({
    base: '/',
    // dev server
    server: {
        port: 3000,
    },

    // preview server
    preview: {
        port: 3010,
    },
    
    css:{
        devSourcemap:true,
    },

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    
    plugins: [
        react({
            jsxRuntime: 'automatic'
        }),
    ],

})

export default viteConfig