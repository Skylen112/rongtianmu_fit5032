<template>
  <div id="menu" class="navbar">
      <div class="nav-container">
        <button class="title" @click="gotohome('/')">MyMentalHub</button>
        <ul class="nav-menu">
          <li><button class="menu-btn" @click="gotopost('Post')">Post</button></li>
          <li><button class="menu-btn" @click="gotoblog('Blog')">Blog</button></li>
          <li><button class="menu-btn" @click="gotoactivity('Activity')">Activity</button></li>
          <l1><button class="menu-btn" @click="gotocontact('Contact')">Contact</button></l1>
        </ul>
        <div class="auth-buttons">
          <template v-if="!isLoggedIn">
            <button class="auth-btn login-btn" @click="gotoLogin">Login</button>
            <button class="auth-btn signup-btn" @click="gotoRegister">Sign Up</button>
          </template>
          <template v-else>
            <button class="auth-btn profile-btn" @click="gotoProfile">Profile</button>
            <button class="auth-btn logout-btn" @click="logout">Logout</button>
          </template>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/init.js'
import { signOut } from "firebase/auth"

const router = useRouter()

const gotoRegister= () => router.push('/register')

const gotoLogin= () => router.push('/login')

const gotopost= () => router.push('/post')

const gotoblog =  () => router.push('/blog')

const gotoactivity = () => router.push('/activity')

const gotocontact = () => router.push('/contact')

const gotoProfile = () => router.push('/profile')

const gotohome = () => router.push('/')

// logging status
const isLoggedIn = ref(false)
const isLoading = ref(true)

let unsubscribe = null

onMounted(() => {
  unsubscribe = auth.onAuthStateChanged(user => {
    console.log('Auth changed:', user ? user.uid : 'null')  // logs
    isLoggedIn.value = !!user
    isLoading.value = false
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

const logout = async () => {
  try {
    await signOut(auth)  // Firebase logout
    console.log('Logged out successfully')

  } catch (error) {
    console.error('Logout error:', error)
    alert('logout failed, Please try again')
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 80px;
  z-index: 1000;
  /* background: #80A1BA; */
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  box-sizing: border-box;
  flex-shrink:0;
}

.nav-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 0 2rem;
  gap: 2rem;
  box-sizing: border-box;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-menu li { margin: 0; }

.menu-btn {
  background: none;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  border-radius: 5px;
  transition: background 0.3s;
}

.menu-btn:hover { background: rgba(255, 255, 255, 0.2); }

.auth-buttons {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.auth-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid #80A1BA;
  transition: all 0.3s;
}

.login-btn {
  background: transparent;
  color: #B4DEBD;
}

.login-btn:hover {
  background: rgba(128, 161, 186, 0.1);
}

.signup-btn {
  background: #80A1BA;
  color: white;
}

.signup-btn:hover {
  background: #B4DEBD;
}

.login-btn:hover{
  background: white;
}
</style>
