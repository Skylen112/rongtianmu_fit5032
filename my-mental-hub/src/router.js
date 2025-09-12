import { createRouter, createWebHistory } from 'vue-router'
import SignUp from "./views/SignUp.vue"
import Home from './views/Home.vue'
import FirebaseSigninView from  './views/FirebaseSigninView.vue'
import userProfile from './views/userProfile.vue'
import PostPage from './views/PostPage.vue'

const routes =[
  {
    path :'/register',
    name:'register',
    component: SignUp
  },
  {path: '/login', component: FirebaseSigninView},
  { path:'/home', name:'home', component: Home},
  {path:'/profile',name:'profile',component:userProfile},
  {path:'/post',name:'post',component:PostPage}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
