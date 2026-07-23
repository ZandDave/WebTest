<script setup>
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import MusicPlayer from './components/MusicPlayer.vue'
</script>

<template>
  <div class="app-wrapper">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
    <Footer />
    <MusicPlayer />
  </div>
</template>
