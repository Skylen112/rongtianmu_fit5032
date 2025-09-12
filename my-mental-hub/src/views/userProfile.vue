<template>
  <div class="profile-card">
    <h2>User Profile</h2>
    <div class="info">
      <span class="label">Email:</span> {{ userEmail }}
    </div>
    <div class="info">
      <span class="label">Password:</span> ••••••••
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAuth } from 'firebase/auth'

const userEmail = ref('')

onMounted(() => {
  const auth = getAuth()
  const user = auth.currentUser
  if (user) {
    userEmail.value = user.email
  }
})

</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
}

.profile-card {
  min-width: 400px;
  min-height: 300px;
  margin: 50px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  text-align: left;
  postion: center;
}

.profile-card h2 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.profile-card .info {
  font-size: 18px;
  margin-bottom: 15px;
}

.profile-card .label {
  font-weight: 600;
}

</style>
