<template>
  <div id="app">
    <MenuView />

<!-- title section -->
  <!-- <section class="title">
    <header>Blog Hub</header>
  </section> -->

<!-- blog section -->
  <section class="blog-section">
    <div class="article-card" v-for="article in articles" :key="article.id">
      <!-- title -->
      <div class="article-title">
        {{ article.title }}
      </div>
      <!-- introduction -->
      <div class="article-introduction">
        {{ article.introduction }}
      </div>
      <button type="button" class="btn btn-primary" @click="saveArticle(article)">
        Subscribe
      </button>
    </div>

  </section>
</div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { onMounted, ref } from 'vue'
  import axios from "axios"
  import { getAuth } from "firebase/auth"
  import MenuView from './MenuView.vue'
  import {  collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore'
  import { db } from '@/firebase/init'


  // user auth
  const auth = getAuth()
  const useremail = ref(auth.currentUser?.email || "")

  // vue responsive data
  const articles = ref([])
  const subscribedArticles = ref([])

  onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, "blogs"))
  querySnapshot.forEach(doc => {
    articles.value.push({ id: doc.id, ...doc.data() })
  })
})

  //post request to cloud function/node.js api
  const fetchBlogs = async () =>{
    try{
      const qureySnapshot = await getDocs(collection(db,'blogs'));
      articles.value = qureySnapshot.docs.map(docSnap =>{
        const data = docSnap.data()
        return{
          id: docSnap.id,
          title:data.title,
          introduction:data.introduction
        };
      });
    }catch{
      console.error('Error fetching blogs:');
    }
  };

onMounted(() => {
  fetchBlogs();
});

  // subcribe articles function
 const saveArticle = async (article) => {
  console.log("start")
  if(!useremail.value){
    console.log("Please login first")
    return
  }

  if (!subscribedArticles.value.find(a => a.id === article.id)) {
    subscribedArticles.value.push(article)
  }

  try {
    const res = await fetch('http://localhost:3001/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: useremail.value,
        articleId: article.id
      })
    })

    const data = await res.json()
    if (data.status === "success") console.log("subscribe successful!")
    else console.log("failed to subscribe", data.error)
  } catch(err) {
    console.log("Network or server error:", err)
  }
}

</script>

<style scoped>

#app {
  padding: 130px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

/* blog container */
.blog-section {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* blogs card */
.article-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* card hover */
.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

/* title */
.article-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #34495e;
}

/* introduction */
.article-introduction {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 15px;
  color: #555;
}

/* subscribe */
.article-card .btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #1abc9c;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.article-card .btn:hover {
  background-color: #16a085;
}

</style>
