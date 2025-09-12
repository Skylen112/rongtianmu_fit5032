<template>
  <div class="container">
    <div class="grid">
      <div
        class="item"
        v-for="(post, index) in posts"
        :key="index"
        @click="ratePost(index)"
      >
        <p><strong>Email:</strong> admin@gmail.com</p>
        <p><strong>Post:</strong> {{ post.content }}</p>
        <p><strong>Average Rating:</strong> {{ averageRating(post) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>


</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.item {
  border: 2px solid black;
  border-radius: 10px;
  text-align: left;
  min-height: 100px;
  display: flex;
  align-items: center;
}
.item:hover {
  background-color: #f5f5f5;
}
</style>
