import { createRouter, createWebHistory } from 'vue-router'
import SignUp from "./views/SignUp.vue"
import Home from './views/Home.vue'


const routes =[
  {
    path :'/FireLogin',
    name:'FireLogin',
    component: SignUp
  },
  { path:'/home', name:'Home', component: Home}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
