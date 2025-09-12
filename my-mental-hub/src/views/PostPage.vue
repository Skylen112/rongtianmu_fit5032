<template>
  <div class="grid">
    <div v-for="post in posts" :key="post.id" class="item">
      <p><strong>Email:</strong> {{ post.email }}</p>
      <p><strong>Post:</strong> {{ post.content }}</p>
      <p><strong>Average Rating:</strong> {{ post.averageRating }}</p>

      <!-- 点击评分 -->
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
import { db } from '@/firebase/init.js'; // 确认 init.js 导出 { db }

export default {
  setup() {
    const posts = ref([]);
    const email = "admin@gmail.com"; // 当前用户邮箱，可替换成登录用户

    // 获取 posts 并计算平均分
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

    // 点击评分
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
        fetchPosts(); // 更新平均分
      } catch (err) {
        console.error('Error submitting rating:', err);
      }
    };

    onMounted(() => {
      fetchPosts();
    });

    return {
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

