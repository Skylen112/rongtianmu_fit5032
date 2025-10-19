<template>
  <div id="app">
    <MenuView />
    <main id="body" class="hero" aria-labelledby="hero-heading">
      <div class="hero-content">
        <div class="promo-badge" aria-hidden="true"></div>
        <h1 id="hero-heading" class="main-title">
          <span>Enjoy Our</span>
          <span class="highlight">Mental Hub</span>
        </h1>
        <p class="description">
          Unwind in your own cozy corner – Savor the peace with expert insights.
        </p>
        <button class="start-btn"
                @click="btnClick('activity')"
                aria-label="Start your Mental Hub journey">
          Start Journey
        </button>
      </div>
    </main>

    <section id="bottom" aria-labelledby="features-heading">
      <h2 id="features-heading" class="section-title">Explore Our Features</h2>
      <div class="cards-container">
        <div class="card-1" tabindex="0" aria-labelledby="post-title">
          <h3 id="post-title">Post</h3>
          <p>Posts allow users to share text, images, videos, and links on social platforms. Users can express thoughts, engage through likes and comments, and control visibility settings for their content.</p>
        </div>
        <div class="card-1" tabindex="0" aria-labelledby="blog-title">
          <h3 id="blog-title">Blog</h3>
          <p>Blogs enable users to publish long-form articles and essays. Readers can subscribe to favorite articles and receive new posts directly in their email inbox, creating a personalized content feed based on their interests.</p>
        </div>
        <div class="card-1" tabindex="0" aria-labelledby="activity-title">
          <h3 id="activity-title">Activity</h3>
          <p>Activity provides a real-time interactive map where users can discover nearby youth activity centers, view available programs, and calculate optimal routes for navigation, making it easy to find and access local youth activities.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MenuView from './MenuView.vue'

const router = useRouter()

const btnClick = (text) => {
  console.log(`Clicked: ${text}`)
  router.push('/activity')
}

</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: #80A1BA;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: inherit;
}


#app {
  display: flex;
  min-height:100vh;
  height:auto;
  flex-direction: column;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  background: #80A1BA;
  font-family: 'Arial', sans-serif;
  color: #000;
  /* width: 100vw; */
  width:100%;
}

body {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
body::-webkit-scrollbar {
  display: none;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
}


.subtitle {
  position: absolute;
  bottom: -20px;
  left: 50%;
  box-sizing: border-box;
  transform: translateX(-50%);
  text-align: center;
  font-size: 1.1rem;
  font-style: italic;
  color: #fff;
  background: rgba(128, 161, 186, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  white-space: nowrap;
}

.hero {
  left:0px;
  right:0px;
  width:100%;
  margin-top: 80px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  background: #80A1BA;
  flex:1;
  min-height:calc(100vh - 80px);
  display: flex;
  overflow-x: hidden;
  overflow-y:hidden;
}

.hero-content {
  flex: 1;
  padding: 4rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  max-width: none;
}

.main-title {
  font-size: 4rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #000;
}

.main-title .highlight { color: #91C4C3; }

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: #000;
  flex-grow: 1;
  word-break: break-word;
}

.start-btn {
  align-self: flex-start;
  background: linear-gradient(135deg, #91C4C3, #80A1BA);
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
#bottom {
  position: relative;
  top: 0;
  left: 0;
  width:100%;
  height: 100vh;
  background-color: #80A1BA;;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 4rem 3rem;
  overflow-x: hidden;
  box-sizing: border-box;
  color: #000;
}

.section-title {
  text-align: center;
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 3rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  gap: 1%;
}

.card-1 {
  flex: 1 1 0;
  min-width: 300px;
  max-width: none;
  background: rgba(255, 247, 221, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: all 0.3s ease;
}

.card-1:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.feature h1 {
  color: #80A1BA;
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-align: center;
}

.feature h2 {
  line-height: 1.6;
  font-size: 1rem;
  text-align: justify;
  color: #333;
}

@media (max-width: 768px) {
  #bottom {
    height: auto;
    padding: 3rem 1.5rem;
  }

  .section-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .cards-container {
    flex-direction: column;
    align-items: center;
  }

  .card-1 {
    flex: 1 1 300px;
    min-width: 300px;
    max-width: 350px;
}
}

</style>
