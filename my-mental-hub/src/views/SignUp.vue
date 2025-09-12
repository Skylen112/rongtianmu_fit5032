<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <!-- title -->
        <h1 class="signup-title">Sign Up Page</h1>


        <form @submit.prevent="submitForm">


           <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="formData.email"
              @input="() => validateEmail(false)"
              />
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
           </div>

          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="formData.username"
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
              @input="() => validatePhone(false)"
            />
            <div v-if="errors.phone" class="text-danger">{{ errors.phone }}</div>
          </div>

          <!-- Admin Option -->
          <div class="mb-3 d-flex align-items-center">
            <input
              type="checkbox"
              id="isAdmin"
              v-model="formData.isAdmin"
              class="form-check-input"
              style="width: 24px; height: 24px; margin-right: 10px;"
            >
            <label for="isAdmin" class="form-check-label" style="font-size: 1.2rem; font-weight: 600;">
              Register as Admin
            </label>
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

import {getAuth, createUserWithEmailAndPassword} from "firebase/auth"
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const formData = ref({
  email:'',
  username: '',
  password: '',
  gender: '',
  phone: '',
  isAdmin: false,
});

const errors = ref({
  email: null,
  username: null,
  password: null,
  phone: null
});



const clearForm = () => {
  formData.value = { email:'', username: '', password: '', gender: '', phone: '' };
  errors.value = { email: null, username: null, password: null, phone: null };
};

// validate email
const validateEmail = () => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(formData.value.email)) {
    errors.value.email = "Email is invalid";
    return false;
  }
  errors.value.email = null;
  return true;
};

// Missing error & Length error
const validateName = () => {
  const username = formData.value.username;
  if (!username) {
    errors.value.username = "Username is required";
    return false;
  } else if (username.length < 3) {
    errors.value.username = "Username must be at least 3 characters";
    return false;
  }
  errors.value.username = null;
  return true;
};

// Length Error & Strength Error
const validatePassword = () => {
  const password = formData.value.password;
  const minLength = 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    errors.value.password = `Password must be at least ${minLength} characters long.`;
    return false;
  } else if (!hasUppercase) {
    errors.value.password = "Password must contain at least one uppercase letter.";
    return false;
  } else if (!hasLowercase) {
    errors.value.password = "Password must contain at least one lowercase letter.";
    return false;
  } else if (!hasNumber) {
    errors.value.password = "Password must contain at least one number.";
    return false;
  } else if (!hasSpecialChar) {
    errors.value.password = "Password must contain at least one special character.";
    return false;
  } else {
    errors.value.password = null;
    return true;
  }
};

// Length error & InvalidFormat error
const validatePhone = () => {
  const value = formData.value.phone || '';
  if (value.length !== 10) {
    errors.value.phone = "Phone number must be 10 digits";
    return false;
  } else if (!/^\d+$/.test(value)) {
    errors.value.phone = "Phone must contain only digits";
    return false;
  }
  errors.value.phone = null;
  return true;
};


const submitForm = async () => {
  console.log("submitForm triggered");

  const emailValid = validateEmail(true);
  const nameValid = validateName(true);
  const passwordValid = validatePassword(true);
  const phoneValid = validatePhone(true);
  console.log("Is Admin:", formData.value.isAdmin);

  if (!emailValid || !nameValid || !passwordValid || !phoneValid) {
    console.log("Please fix errors first");

    return;
  }

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password
    );
    console.log("Firebase Register Successful!", userCredential.user);
    alert("Register Successful!");

    const db = getFirestore();
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: formData.value.email,
      username: formData.value.username,
      phone: formData.value.phone,
      gender: formData.value.gender,
      role: formData.value.isAdmin ? "admin" : "user"
    });

    router.push("/FireLogin");
  } catch (error) {
    console.error("Error:", error.code, error.message);
    errors.value.firebase = error.message;
  }
};




</script>

<style scoped>
.col-md-6.col-lg-5 {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 120%;
}

.signup-title{
  font-weight: bold;
  max-width:100%;
  white-space: nowrap;
  margin-left: auto;
  margin-right: auto;
  align-items: center;
}

.mb-3 {
  margin-bottom: 1rem;
  max-width: 80%;
  text-align: center;
  font-family: "Lucida Console", "Courier New", monospace;
  margin-left:auto;
  margin-right:auto;
}

form {
  border-radius: 20px;
  background-color: rgb(145, 140, 140);
  padding: 20px;
  position: middle;
  width:550px;
  margin-left:auto;
  margin-right:auto;
}

input{
  color: rgb(120, 119, 119);
  font-family:Arial, Helvetica, sans-serif;
}

textarea{
  background-color:black;
}


</style>
