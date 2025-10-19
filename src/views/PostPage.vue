<template>
  <div class="container">
    <MenuView />

    <main role="main" aria-label="User Posts">
      <section class="posts-section" aria-label="User Posts List">
        <div
          v-for="post in posts"
          :key="post.id"
          class="item"
          tabindex="0"
          :aria-label="'Post by ' + post.email + ', average rating: ' + post.averageRating + ' out of 5'"
        >
          <div class="post-content">
            <p><strong>Email:</strong> <span class="content-text">{{ post.email }}</span></p>
            <p><strong>Content:</strong> <span class="content-text">{{ post.content }}</span></p>
            <p><strong>Average Rating:</strong> <span class="rating-text">{{ post.averageRating }} / 5</span></p>
          </div>

          <div class="rating" aria-label="Rate this post">
            <span
              v-for="n in 5"
              :key="n"
              class="star"
              :class="{ 'filled': post.averageRating >= n }"
              role="button"
              :tabindex="0"
              :aria-label="'Rate ' + n + ' stars'"
              @click="submitRating(post, n)"
              @keydown.enter="submitRating(post, n)"
            >
              ★
            </span>
          </div>
        </div>
      </section>

      <section class="post-form-section" aria-labelledby="create-post-heading">
        <h2 id="create-post-heading">Create Post</h2>
        <form @submit.prevent="addPost">
          <textarea
            v-model="newContent"
            placeholder="What's on your mind?"
            class="content-input"
            required
            aria-label="Post content"
          ></textarea>
          <button type="submit" class="submit-btn">Post</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, doc, updateDoc, arrayUnion , addDoc} from 'firebase/firestore';
import { db } from '@/firebase/init.js';
import { useRouter } from 'vue-router';
import MenuView from './MenuView.vue'

const posts = ref([]);
const email = "admin@gmail.com";
const router = useRouter();
const newContent = ref('');
const currentUser = ref(null);
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/init.js';

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
    if (user) {
      fetchPosts();
    }
  });
});


const addPost = async () => {

  if (!newContent.value.trim()) {
    alert('Content cannot be empty');
    return;
  }

  if (!currentUser.value) {
    alert('Please sign in first');
    return;
  }

  try {
    await addDoc(collection(db, 'posts'), {
      userId:currentUser.value.uid,
      email: currentUser.value.email,
      content: newContent.value.trim(),
      ratings: [],  // initialize the template
      createdAt: new Date()
    });
    alert('Post Created Successfully');
    newContent.value = '';  // clean the template
    fetchPosts();  // refresh the template
  } catch (err) {
    console.error('Error adding post:', err);
    if (err.code === 'permission-denied') {
      alert('access denied: please login or check userId');
    } else {
      alert('Failed to post');
    }
  }
};

const fetchPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    posts.value = querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      const ratings = data.ratings || [];
      const avg = ratings.length > 0
        ? ratings.reduce((a, b) => a + b.score, 0) / ratings.length
        : 0;
      return {
        id: docSnap.id,
        email: data.email,
        content: data.content,
        ratings: ratings,
        averageRating: avg.toFixed(1)
      };
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
  }
};

const submitRating = async (post, score) => {
  try {
    const postRef = doc(db, 'posts', post.id);
    await updateDoc(postRef, {
      ratings: arrayUnion({
        user: email,
        score: score
      })
    });
    alert(`You rated ${score} stars`);
    fetchPosts();
  } catch (err) {
    console.error('Error submitting rating:', err);
  }
};

onMounted(() => {
  fetchPosts();
});
</script>

<style scoped>
.container {
  background-color: #80A1BA;
  min-height: 100vh;
  padding: 80px 40px 20px;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.posts-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 1300px;
  /* margin: 0 auto 40px auto; */
  margin:40px auto 40px;
}

.item {
  background: linear-gradient(135deg, #ffffff, #f0f8ff);
  border: 1px solid #80A1BA;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(128, 161, 186, 0.3);
  display: flex;
  flex-direction: column;
  min-height: 150px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(128, 161, 186, 0.4);
}

.rating {
  margin-top: auto;
  display: flex;
  gap: 5px;
  padding-top: 15px;
}

.star {
  cursor: pointer;
  font-size: 24px;
  color: #ddd;
  user-select: none;
  transition: color 0.2s ease-in-out;
}

.star.filled,
.star:hover {
  color: #FFD700;
}

.post-form-section {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.post-form-section textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  font-size: 14px;
  resize: vertical;
  margin-bottom: 12px;
}

.post-form-section button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #80A1BA;
  color: #fff;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.post-form-section button:hover {
  background: #6b8aa3;
}

/* Responsive */
@media (max-width: 1024px) {
  .posts-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .posts-section {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 20px 10px;
  }
}
</style>
