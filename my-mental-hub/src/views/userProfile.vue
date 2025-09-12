<template>
<h1>User Profile</h1>
<p>User Name</p>
<p>Email: {{ userEmail }}</p>
<p>Password: ********</p>
<p>Bio</p>
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
