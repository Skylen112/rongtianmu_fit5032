<template>
  <div class="grid">
    <div v-for="post in posts" :key="post.id" class="item">
      <p><strong>Email:</strong> {{ post.email }}</p>
      <p><strong>Post:</strong> {{ post.content }}</p>
      <p><strong>Average Rating:</strong> {{ post.averageRating }}</p>

      <div class="rating">
        <span
          v-for="n in 5"
          :key="n"
          class="star"
          @click="submitRating(post, n)">
          {{ n }} ⭐
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebase/init.js';

export default {
  setup() {
    const posts = ref([]);
    const email = "admin@gmail.com";



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

    return {
      email,
      posts,
      submitRating
    };
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.item {
  border: 2px solid #333;
  border-radius: 10px;
  padding: 10px;
  min-height: 120px;
}
.rating {
  margin-top: 5px;
}
.star {
  cursor: pointer;
  margin-right: 5px;
  font-weight: bold;
  user-select: none;
}
.star:hover {
  color: gold;
}
</style>

