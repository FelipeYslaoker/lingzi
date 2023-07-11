export default defineNuxtRouteMiddleware((to) => {
  if (useAuth().loggedIn && to.path === '/login') {
    return navigateTo('/')
  }
  if (!useAuth().loggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }
})
