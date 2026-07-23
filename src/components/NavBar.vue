<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <nav class="navbar">
    <div class="nav-inner">
      <router-link to="/" class="logo">SCZ</router-link>
      <div class="nav-links">
        <router-link to="/" :class="{ active: route.path === '/' }">文章</router-link>
        <router-link to="/about" :class="{ active: route.path === '/about' }">关于</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.5px;
}
.nav-links {
  display: flex;
  gap: 28px;
}
.nav-links a {
  font-size: 0.95rem;
  color: var(--text-light);
  text-decoration: none;
  transition: color 0.2s;
  padding: 4px 0;
  border-bottom: 2px solid transparent;
}
.nav-links a:hover,
.nav-links a.active {
  color: var(--text);
  border-bottom-color: var(--accent);
}
</style>
