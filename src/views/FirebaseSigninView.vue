<template>
  <div class="signin-container">
    <h1 id="signin-heading">Sign In</h1>

    <form @submit.prevent="signin" aria-labelledby="signin-heading">
      <!-- Email -->
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          class="form-input"
          placeholder="Enter your email"
          aria-required="true"
          required
        />
      </div>

      <!-- Password -->
      <div class="form-group">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          type="password"
          v-model="password"
          class="form-input"
          placeholder="Enter your password"
          aria-required="true"
          required
        />
      </div>

      <!-- Submit -->
      <button
        type="submit"
        class="signin-button"
        aria-label="Sign in with your email and password"
      >
        Sign in via Firebase
      </button>

      <!-- Error message -->
      <p
        v-if="errorMessage"
        class="error-message"
        role="alert"
        aria-live="assertive"
      >
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
import { auth } from "@/firebase/init.js"

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const router = useRouter()

const signin = async () => {
  errorMessage.value = ""
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
    const user = userCredential.user
    const idToken = await user.getIdToken()
    console.log("Firebase ID Token:", idToken)
    console.log("Firebase Signin Successful!", userCredential.user)
    router.push("/")
  } catch (error) {
    console.log(error.code, error.message)
    errorMessage.value = "Invalid email or password. Please try again."
  }
}
</script>

<style scoped>
/* Layout */
.signin-container {
  max-width: 400px;
  margin: 4rem auto;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

/* Heading */
h1 {
  text-align: center;
  color: #80a1ba;
  margin-bottom: 1.5rem;
}

/* Form */
.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #2d3e50;
}

.form-input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 2px solid #80a1ba;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3e50;
}

.form-input:focus {
  outline: 3px solid #80a1ba;
  box-shadow: 0 0 4px rgba(128, 161, 186, 0.6);
}

/* Button */
.signin-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #80a1ba;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signin-button:hover,
.signin-button:focus {
  background-color: #6d8fa5;
  outline: none;
}

/* Error */
.error-message {
  color: #d9534f;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.8rem;
}

/* Accessibility focus visible */
:focus-visible {
  outline: 3px solid #80a1ba;
  outline-offset: 2px;
}
</style>
