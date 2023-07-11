// https://nuxt.com/docs/api/configuration/nuxt-config
import { md3 } from 'vuetify/blueprints'

export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  imports: {
    dirs: ['stores']
  },
  pinia: {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  },
  modules: [
    '@invictus.codes/nuxt-vuetify',
    '@nuxt-alt/auth',
    '@pinia/nuxt',
    '@nuxtjs/eslint-module'
  ],
  eslint: {},
  http: {
    baseURL: 'http://localhost:4000',
    browserBaseURL: 'http://localhost:4000'
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          maxAge: 43200
        },
        user: {
          property: 'user'
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          user: { url: '/auth/user', method: 'get' },
          logout: { url: '/auth/logout', method: 'post' }
        }
      }
    }
  },
  vuetify: {
    vuetifyOptions: {
      blueprint: md3,
      theme: {
        defaultTheme: 'dark',
        themes: {
          dark: {
            colors: {
              primary: '#1696b6'
            }
          }
        }
      }
    }
  }
})
