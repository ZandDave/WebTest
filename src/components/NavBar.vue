<template>
  <nav class="navbar">
    <div class="nav-inner">
      <router-link to="/" class="logo">森林</router-link>
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
  justify-content: center;
}
.logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text);
  text-decoration: none;
  letter-spacing: -0.5px;
}
</style>
