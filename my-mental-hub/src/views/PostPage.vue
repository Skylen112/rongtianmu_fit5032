<template>
  <div class="container">
    <MenuView />
    <div class="posts-section">
      <div v-for="post in posts" :key="post.id" class="item">
        <div class="post-content">
          <p><strong>Email:</strong> <span class="content-text">{{ post.email }}</span></p>
          <p><strong>Content:</strong> <span class="content-text">{{ post.content }}</span></p>
          <p><strong>Average Rating:</strong> <span class="rating-text">{{ post.averageRating }} / 5</span></p>
        </div>

        <div class="rating">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ 'filled': post.averageRating >= n }"
            @click="submitRating(post, n)">
            ★
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebase/init.js';
import { useRouter } from 'vue-router';
import MenuView from './MenuView.vue'

const posts = ref([]);
const email = "admin@gmail.com";
const router = useRouter();

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
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.posts-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.item {
  background: linear-gradient(135deg, #ffffff, #f0f8ff);
  border: 1px solid #80A1BA;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(128, 161, 186, 0.3);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  min-height: 150px;
}

.item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(128, 161, 186, 0.4);
}

.post-content {
  flex-grow: 1;
}

.content-text {
  color: #333;
  font-size: 14px;
  line-height: 1.5;
  display: block;
  margin-top: 5px;
}

.rating-text {
  color: #555;
  font-weight: bold;
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
  transition: color 0.2s ease-in-out;
  user-select: none;
}

.star:hover,
.star.filled {
  color: #FFD700;
}

@media (max-width: 1024px) {
  .posts-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .posts-section {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .item {
    padding: 15px;
  }
}
</style>
