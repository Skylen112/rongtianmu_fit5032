import { createRouter, createWebHistory } from 'vue-router'
import SignUp from "./SignUp.vue"
import Home from './Home.vue'

const routes = [
  { path: '/', name: 'SignUp', component: SignUp },
    { path: '/home', name: 'Home', component: Home }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router