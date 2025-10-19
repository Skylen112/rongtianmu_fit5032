<template>
  <MenuView />
  <div class="container">
    <div class="profile-card">
      <h2>User Profile</h2>

      <div v-if="loading" class="loading">Loading user data...</div>
      <div v-else>
        <div class="info">
          <span class="label">Email:</span> {{ userEmail }}
        </div>
        <div class="info">
          <span class="label">Password:</span> ••••••••
        </div>

        <div class="stats">
          <h3>Posting Statistics</h3>
          <div class="info"><span class="label">Total Posts:</span> {{ totalPosts }}</div>
          <div class="info"><span class="label">Average per Day:</span> {{ averagePerDay }}</div>
        </div>

        <div v-if="Object.keys(dailyTrend).length">
          <h4>Explore Your Posts history:</h4>
          <ul class="trend-list">
            <li v-for="(count, date) in dailyTrend" :key="date">
              {{ date }} — {{ count }} posts
            </li>
          </ul>
        </div>

        <!-- WCAG AA Accessible Subscribe Section -->
        <div class="subscribe-section" role="region" aria-labelledby="subscribe-title">
          <h3 id="subscribe-title" class="visually-hidden">Welcome Email Subscription</h3>
          <button
            @click="subscribeWelcomeEmail"
            class="btn btn-primary"
            :aria-pressed="subscribed.toString()"
            :disabled="subscribed"
          >
            {{ subscribed ? "Subscribed!" : "Subscribe to Hub's News" }}
          </button>
          <span v-if="subscribed" class="text-success" role="status" aria-live="polite">
            You are now subscribed.
          </span>
        </div>

        <div class="bookings-section" role="region" aria-labelledby="bookings-title">
  <!-- <h3 id="bookings-title">Your Appointments & Daily Trend</h3> -->

  <div v-if="bookings && bookings.length">
    <h3>Your Booked Appointments:</h3>
    <ul>
      <li v-for="booking in bookings" :key="booking.id">
        <strong>{{ booking.mentorName }}</strong>
        <br />
        {{ formatDate(booking.slot) }} — Status: {{ booking.status }}
      </li>
    </ul>
  </div>

  <div v-else>
    <p>No appointments booked yet.</p>
  </div>
</div>

        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth'

// --- State ---
const userEmail = ref('')
const totalPosts = ref(0)
const averagePerDay = ref(0)
const dailyTrend = ref({})
const loading = ref(true)
const error = ref(null)
const subscribed = ref(false);
const bookings = ref([]);
const db = getFirestore();
const auth = getAuth();
import MenuView from './MenuView.vue'


// formatDate
const formatDate = (slot) => {
  if (!slot) return 'N/A';
  const [start, end] = slot.split('-');
  if (!start || !end) return 'Invalid time';
  return `${start.trim()} - ${end.trim()}`;  // "09:00 - 10:00"
};

// --- Lifecycle ---
onMounted(async () => {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    error.value = 'User not logged in.'
    loading.value = false
    return
  }

  userEmail.value = user.email

  try {
    const token = await user.getIdToken()
    console.log('refresh token:', token ? 'success' : 'fail');
    const response = await fetch('http://localhost:3001/userDashboard', {
      headers: { Authorization: `Bearer ${token}` },
      });

    if (!response.ok) {
      const errorText = await response.text();  //
      console.error('401 details:', errorText);  // e.g., "Missing token" or "Invalid token"
      throw new Error(`Server returned ${response.status}: ${errorText}`);
    }

    const data = await response.json()
    totalPosts.value = data.totalPosts
    averagePerDay.value = data.averagePerDay
    dailyTrend.value = data.dailyTrend

     const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      subscribed.value = userDoc.data().subscribedToWelcome || false;
      const bookingIds = userDoc.data().bookings || [];
      console.log('Booking IDs from user doc:', bookingIds);

      if (bookingIds.length > 0) {
        // query: booking doc + join mentorName
        const bookingPromises = bookingIds.map(async (id) => {
          const bookingDocRef = doc(db, 'bookings', id);
          const bookingSnap = await getDoc(bookingDocRef);
          if (bookingSnap.exists()) {
            const bookingData = bookingSnap.data();
            // join mentorName
            if (bookingData.mentorId) {
              const mentorDocRef = doc(db, 'timetables', bookingData.mentorId);
              const mentorSnap = await getDoc(mentorDocRef);
              if (mentorSnap.exists()) {
                bookingData.mentorName = mentorSnap.data().name;
              } else {
                bookingData.mentorName = 'Unknown Mentor';
              }
            }
            return { id, ...bookingData };
          }
          return null;
        });

        const results = await Promise.all(bookingPromises);
        bookings.value = results.filter(b => b !== null);
        console.log('Loaded full bookings:', bookings.value);  // debugging：check slot/status/mentorName
      }
    }
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    error.value = 'Failed to load user dashboard.'
  } finally {
    loading.value = false
  }
})

const subscribeWelcomeEmail = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in first!");
    return;
  }

  try {
    await updateDoc(doc(db, "users", user.uid), {
      subscribedToWelcome: true
    });
    subscribed.value = true;
    alert("You are now subscribed to welcome emails!");
  } catch (err) {
    console.error(err);
    alert("Failed to subscribe. Try again later.");
  }
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
  background: #80A1BA;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 20px;
  box-sizing: border-box;
  margin-top: 80px;
}

.profile-card {
  width: 100%;
  max-width: 420px;
  padding: 32px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: box-shadow 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1f2937;
  letter-spacing: -0.025em;
  position: relative;
}

h2::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  margin-top: 8px;
}

.info {
  font-size: 16px;
  margin-bottom: 16px;
  line-height: 1.6;
  color: #4b5563;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  color: #374151;
  min-width: 100px;
  display: inline-block;
}

.stats {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 2px solid #e5e7eb;
}

.stats h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #80A1BA;
  letter-spacing: -0.01em;
}

.trend-list {
  list-style: none;
  padding-left: 0;
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.5;
}

.trend-list li {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  margin-bottom: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.trend-list li:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.trend-list li strong {
  color: #1f2937;
  font-weight: 600;
}

.loading {
  text-align: center;
  font-size: 16px;
  color: #6b7280;
  padding: 40px;
  font-style: italic;
}

.error {
  margin-top: 16px;
  color: #dc2626;
  font-weight: 500;
  text-align: center;
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.subscribe-section {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
}

.subscribe-section button {
  width: 100%;
  padding: 12px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.subscribe-section button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.subscribe-section button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

.bookings-section {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  border-left: 4px solid #10b981;
}

.bookings-section h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #80A1BA;
  letter-spacing: -0.01em;
}

.bookings-section ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.bookings-section li {
  background: white;
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #80A1BA;
  transition: box-shadow 0.2s ease;
  line-height: 1.6;
  font-size: 15px;
  color: #80A1BA;
}

.bookings-section li:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bookings-section li strong {
  color: #059669;
  font-size: 16px;
  display: block;
  margin-bottom: 4px;
}

.bookings-section p {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 20px;
}

/* responsive */
@media (max-width: 480px) {
  .profile-card {
    padding: 24px;
    margin: 10px;
  }

  h2 {
    font-size: 24px;
  }

  .info {
    font-size: 15px;
    flex-direction: column;
    align-items: flex-start;
  }

  .label {
    min-width: auto;
    margin-bottom: 4px;
  }
}
</style>
