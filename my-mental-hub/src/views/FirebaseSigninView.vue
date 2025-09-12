<template>
  <h1>Sign in</h1>
  <p><input type="text" placeholder="Email" v-model ="email"/></p>
  <p><input type="password" placeholder="Password" v-model="password" /></p>
  <p><button @click="signin">Sign in via Firebase</button></p>
</template>

<script setup>
import { ref } from "vue"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
import { auth } from "@/firebase/init.js"   // ✅ 从 init.js 导入 auth

const email = ref("")
const password = ref("")
const router = useRouter()

const signin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log("Firebase Signin Successful!", userCredential.user)
    router.push("/home")
  } catch (error) {
    console.log(error.code, error.message)
  }
}
</script>
