<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <!-- title -->
        <h1 class="text-center mb-3">Sign Up Page</h1>

        <!-- temlate -->
        <form @submit.prevent="submitForm">
          
          <!-- Username -->
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input 
              type="text" 
              class="form-control" 
              id="username"
              v-model="formData.username"
              @blur="() => validateName(true)"
              @input="() => validateName(false)" 
            />
            <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              class="form-control" 
              id="password"
              v-model="formData.password"
              @blur="() => validatePassword(true)"
              @input="() => validatePassword(false)" 
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>
          <!-- Gender -->
          <div class="mb-3">
            <label for="gender" class="form-label">Gender</label>
            <select 
              class="form-select" 
              id="gender" 
              v-model="formData.gender"
            >
              <option disabled value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Phone -->
          <div class="mb-3">
            <label for="phone" class="form-label">Phone</label>
            <input 
              type="text"
              id="phone"
              class="form-control"
              v-model="formData.phone"
              @blur="() => validatePhone(true)"
              @input="() => validatePhone(false)"
            />
            <div v-if="errors.phone" class="text-danger">{{ errors.phone }}</div>
          </div>

          <!-- Buttons -->
          <div class="text-center mt-4">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const formData = ref({
  username: '',
  password: '',
  gender: '',
  phone: ''
});

const errors = ref({
  username: null,
  password: null,
  phone: null
});

const clearForm = () => {
  formData.value = { username: '', password: '', gender: '', phone: '' };
  errors.value = { username: null, password: null, phone: null };
};

// Missing error & Length error
const validateName = (blur) => {
  if (!formData.value.username) {
    if (blur) errors.value.username = "Username is required";
  } else if (formData.value.username.length < 3) {
    if (blur) errors.value.username = "Username must be at least 3 characters";
  } else {
    errors.value.username = null;
  }
};

// Length Error & Strength Error
const validatePassword = (blur) => {
  const password = formData.value.password;
  const minLength = 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`;
  } else if (!hasUppercase) {
    if (blur) errors.value.password = "Password must contain at least one uppercase letter.";
  } else if (!hasLowercase) {
    if (blur) errors.value.password = "Password must contain at least one lowercase letter.";
  } else if (!hasNumber) {
    if (blur) errors.value.password = "Password must contain at least one number.";
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = "Password must contain at least one special character.";
  } else {
    errors.value.password = null;
  }
};

// Length error & InvalidFormat error
const validatePhone = (blur) => {
  const value = formData.value.phone || '';

  if(value.length != 10){
    if(blur)errors.value.phone = "Phone number must be 10 characters long.";
  }else if(!/^\d+$/.test(value)){
    if(blur)errors.value.phone = "Phone must be contain only digits";
  } else {
    errors.value.phone = null;
  }
};

const submitForm = () => {
  validateName(true);
  validatePassword(true);
  validatePhone(true);

  if (!errors.value.username && !errors.value.password && !errors.value.phone) {
    router.push('/Home');
  }
};
</script>

<style scoped>
form {
  border-radius: 10px; 
  background-color: rgb(145, 140, 140);
  padding: 20px; 
}

input{
  color: rgb(120, 119, 119);
}

textarea{
  background-color:black;
}
</style>
