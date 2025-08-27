<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>
<template>
  <div class="home-container">
    <!-- Navigation Header -->
    <header class="header">
      <div class="nav-container">
        <div class="logo">
          <h1 class="logo-text">MyMentalHub</h1>
        </div>
        
        <!-- Burger Menu Button -->
        <button class="burger-btn" @click="toggleMenu" :class="{ active: isMenuOpen }">
          <span class="burger-line"></span>
          <span class="burger-line"></span>
          <span class="burger-line"></span>
        </button>
      </div>

      <!-- Burger Menu Overlay -->
      <div class="menu-overlay" :class="{ active: isMenuOpen }" @click="closeMenu"></div>
      
      <!-- Burger Menu -->
      <nav class="burger-menu" :class="{ active: isMenuOpen }">
        <div class="menu-header">
          <h2 class="menu-title">Menu</h2>
          <button class="close-btn" @click="closeMenu">✕</button>
        </div>
        
        <ul class="menu-list">
          <li class="menu-item" v-for="(item, index) in menuItems" :key="item.name">
            <a href="#" class="menu-link" @click="handleMenuClick(item.name)" 
               :style="{ 'animation-delay': `${index * 0.1}s` }">
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-text">{{ item.name }}</span>
              <span class="menu-arrow">→</span>
            </a>
          </li>
        </ul>
        
        <div class="menu-footer">
          <p class="menu-footer-text">An adventurous journey toward mental well-being</p>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <main class="main-content">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Welcome to MyMentalHub</h1>
          <p class="hero-subtitle">Unwind in Your Own Cozy Corner</p>
          <div class="hero-buttons">
            <button class="btn btn-primary" @click="handleGetStarted">Get started</button>
            <button class="btn btn-secondary" @click="handleLearnMore">learn more</button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header">
          <h2 class="section-title">Core function</h2>
          <p class="section-subtitle">Please explore the core function we build for you guys!</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
            <button class="feature-btn" @click="handleFeatureClick(feature.title)">
              Explore more
            </button>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-container">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">&copy; 2025 MyMentalHub.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isMenuOpen: false,
      menuItems: [
        { name: 'Blog', icon: '📝' },
        { name: 'Post', icon: '📮' },
        { name: 'Chat Group', icon: '💬' },
        { name: 'Activity', icon: '🎯' },
        { name: 'Help', icon: '❓' },
        { name: 'Account', icon: '👤' }
      ],
      features: [
        {
          title: 'Blog',
          icon: '📝',
          description: 'Deep Articles from Various Interest Areas '
        },
        {
          title: 'Post',
          icon: '📝',
          description: 'For All the Feelings and Stories Too Awkward to Say Out Loud'
        },
        {
          title: 'Activity',
          icon: '🎯',
          description: 'Beyond Limits: Youth Creating Meaning Together'
        }
      ],
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    closeMenu() {
      this.isMenuOpen = false;
    },
    handleMenuClick(menuName) {
      console.log(`click the menu: ${menuName}`);
      this.closeMenu();
    },
    handleGetStarted() {
      console.log('get started');
    },
    handleLearnMore() {
      console.log('learn more');
    },
    handleFeatureClick(featureName) {
      console.log(`explore the new feature: ${featureName}`);
    }
  },
  mounted() {
    this.$watch('isMenuOpen', (newVal) => {
      if (newVal) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fffe 0%, #f0fff0 100%);
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Header & Navigation */
.header {
  position: relative;
  z-index: 1000;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(34, 139, 34, 0.1);
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 600;
  color: #228B22;
  margin: 0;
  letter-spacing: -0.5px;
}

/* Burger Button */
.burger-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;
}

.burger-line {
  width: 30px;
  height: 3px;
  background: #228B22;
  margin: 3px 0;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.burger-btn.active .burger-line:nth-child(1) {
  transform: rotate(45deg) translate(9px, 9px);
}

.burger-btn.active .burger-line:nth-child(2) {
  opacity: 0;
}

.burger-btn.active .burger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Menu Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1001;
}

.menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Burger Menu */
.burger-menu {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100%;
  background: white;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 1002;
  overflow-y: auto;
}

.burger-menu.active {
  right: 0;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid rgba(34, 139, 34, 0.1);
  background: linear-gradient(135deg, #228B22, #32CD32);
  color: white;
}

.menu-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  border-bottom: 1px solid rgba(34, 139, 34, 0.05);
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(20px);
  animation: slideInMenu 0.5s ease forwards;
}

@keyframes slideInMenu {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.menu-link:hover {
  background: #f0fff0;
  color: #228B22;
  transform: translateX(5px);
}

.menu-icon {
  font-size: 1.2rem;
  margin-right: 1rem;
  width: 24px;
}

.menu-text {
  flex: 1;
  font-size: 1.1rem;
  font-weight: 500;
}

.menu-arrow {
  color: #228B22;
  font-weight: bold;
  opacity: 0;
  transition: all 0.3s ease;
}

.menu-link:hover .menu-arrow {
  opacity: 1;
  transform: translateX(5px);
}

.menu-footer {
  padding: 2rem;
  text-align: center;
  color: #666;
  border-top: 1px solid rgba(34, 139, 34, 0.1);
  margin-top: auto;
}

.menu-footer-text {
  margin: 0;
  font-size: 0.9rem;
}

/* Main Content */
.main-content {
  padding: 0;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 6rem 2rem;
  text-align: center;
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 300;
  color: #228B22;
  margin: 0 0 1rem 0;
  letter-spacing: -1px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #666;
  margin: 0 0 2.5rem 0;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  min-width: 140px;
}

.btn-primary {
  background: linear-gradient(135deg, #228B22, #32CD32);
  color: white;
  box-shadow: 0 4px 15px rgba(34, 139, 34, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(34, 139, 34, 0.4);
}

.btn-secondary {
  background: white;
  color: #228B22;
  border: 2px solid #228B22;
}

.btn-secondary:hover {
  background: #228B22;
  color: white;
  transform: translateY(-2px);
}

/* Features Section */
.features-section {
  padding: 6rem 2rem;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  color: #228B22;
  margin: 0 0 1rem 0;
  font-weight: 500;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.features-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #f8fffe;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(34, 139, 34, 0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(34, 139, 34, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.5rem;
  color: #228B22;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.feature-desc {
  color: #666;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.feature-btn {
  background: #228B22;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.feature-btn:hover {
  background: #32CD32;
  transform: translateY(-2px);
}

/* Stats Section */
.stats-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #228B22, #32CD32);
  color: white;
}

.stats-container {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Footer */
.footer {
  background: #333;
  color: white;
  padding: 2rem;
  text-align: center;
}

.footer-text {
  margin: 0;
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 1rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-section {
    padding: 4rem 1rem;
  }
  
  .features-section {
    padding: 4rem 1rem;
  }
  
  .burger-menu {
    width: 300px;
    right: -300px;
  }
  
  .floating-card {
    display: none;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .menu-link {
    padding: 1rem;
  }
  
  .menu-header {
    padding: 1.5rem 1rem;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-number {
    font-size: 2rem;
  }
}
</style>