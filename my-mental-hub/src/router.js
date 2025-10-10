import { createRouter, createWebHistory } from 'vue-router'
import SignUp from "./views/SignUp.vue"
import Home from './views/HomePage.vue'
import FirebaseSigninView from  './views/FirebaseSigninView.vue'
import userProfile from './views/UserProfile.vue'
import PostPage from './views/PostPage.vue'
import BlogPage from './views/BlogPage.vue'
import ActivityPage from './views/ActivityPage.vue'
const routes =[
  {
    path :'/register',
    name:'register',
    component: SignUp
  },
  {path: '/login', component: FirebaseSigninView},
  { path:'/', name:'Home', component: Home},
  {path:'/profile',name:'profile',component:userProfile},
  {path:'/post',name:'post',component:PostPage},
  {path:'/blog',name:'blog',component:BlogPage},
  {path:'/activity',name:'activity',component:ActivityPage}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
