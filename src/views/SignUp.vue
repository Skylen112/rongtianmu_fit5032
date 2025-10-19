<template>
  <div class="container mt-5" role="main" aria-labelledby="signup-title">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <!-- Title -->
        <h1 id="signup-title" class="signup-title">Sign Up Page</h1>

        <form @submit.prevent="submitForm" aria-describedby="form-description">
          <p id="form-description" class="visually-hidden">
            Please complete all required fields to create your account.
          </p>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email <span aria-hidden="true">*</span></label>
            <input
              type="email"
              class="form-control"
              id="email"
              v-model="formData.email"
              @input="() => validateEmail(false)"
              required
              aria-required="true"
              aria-invalid="errors.email ? 'true' : 'false'"
            />
            <div v-if="errors.email" class="text-danger" role="alert">{{ errors.email }}</div>
          </div>

          <!-- Username -->
          <div class="mb-3">
            <label for="username" class="form-label">Username <span aria-hidden="true">*</span></label>
            <input
              type="text"
              class="form-control"
              id="username"
              v-model="formData.username"
              @input="() => validateName(false)"
              required
              aria-required="true"
              aria-invalid="errors.username ? 'true' : 'false'"
            />
            <div v-if="errors.username" class="text-danger" role="alert">{{ errors.username }}</div>
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password <span aria-hidden="true">*</span></label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="formData.password"
              @input="() => validatePassword(false)"
              required
              aria-required="true"
              aria-invalid="errors.password ? 'true' : 'false'"
            />
            <div v-if="errors.password" class="text-danger" role="alert">{{ errors.password }}</div>
          </div>

          <!-- Gender -->
          <div class="mb-3">
            <label for="gender" class="form-label">Gender</label>
            <select
              class="form-select"
              id="gender"
              v-model="formData.gender"
              aria-label="Select gender"
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
              inputmode="numeric"
              pattern="[0-9]{10}"
              aria-describedby="phone-help"
              aria-invalid="errors.phone ? 'true' : 'false'"
            />
            <div id="phone-help" class="form-text">Enter a 10-digit phone number</div>
            <div v-if="errors.phone" class="text-danger" role="alert">{{ errors.phone }}</div>
          </div>

          <!-- Admin Option -->
          <div class="mb-3 d-flex align-items-center">
            <input
              type="checkbox"
              id="role"
              v-model="formData.role"
              class="form-check-input"
              :aria-checked="formData.role ? 'true' : 'false'"
            />
            <label for="role" class="form-check-label ms-2">
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
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const formData = ref({
  email: "",
  username: "",
  password: "",
  gender: "",
  phone: "",
  role: false,
});

const errors = ref({
  email: null,
  username: null,
  password: null,
  phone: null,
});

const clearForm = () => {
  formData.value = { email: "", username: "", password: "", gender: "", phone: "", role: false };
  errors.value = { email: null, username: null, password: null, phone: null };
};

const validateEmail = () => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  errors.value.email = pattern.test(formData.value.email) ? null : "Invalid email format";
  return !errors.value.email;
};

const validateName = () => {
  const username = formData.value.username.trim();
  if (!username) errors.value.username = "Username is required";
  else if (username.length < 3) errors.value.username = "Must be at least 3 characters";
  else errors.value.username = null;
  return !errors.value.username;
};

const validatePassword = () => {
  const password = formData.value.password;
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  errors.value.password = pattern.test(password)
    ? null
    : "Password must include upper, lower, number and special character";
  return !errors.value.password;
};

const validatePhone = () => {
  const phone = formData.value.phone;
  errors.value.phone = /^\d{10}$/.test(phone) ? null : "Phone number must be 10 digits";
  return !errors.value.phone;
};

const submitForm = async () => {
  const valid =
    validateEmail() && validateName() && validatePassword() && validatePhone();

  if (!valid) return;

  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password
    );

    const db = getFirestore();
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: formData.value.email,
      username: formData.value.username,
      phone: formData.value.phone,
      gender: formData.value.gender,
      role: formData.value.role ? "admin" : "user",
    });

    alert("Register Successful!");
    router.push("/login");
  } catch (error) {
    console.error("Firebase error:", error.message);
  }
};
</script>

<style scoped>
.signup-title {
  font-weight: bold;
  text-align: center;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
