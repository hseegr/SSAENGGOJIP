import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'

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
    
    plugins: [
        react({
            jsxRuntime: 'automatic'
        }),
    ],

})

export default viteConfig