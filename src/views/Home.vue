<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const entries = [
  { id: 'characters', title: '人设', icon: '👤', desc: '角色档案与设定集', color: '#8b5cf6' },
  { id: 'storyline', title: '故事线', icon: '📜', desc: '世界观与时间线', color: '#e6a817' },
  { id: 'archive', title: '档案室', icon: '📁', desc: '文字档案 · 图像档案', color: '#10b981' }
]
</script>

<template>
  <section class="hero">
    <h1 class="hero-title">forest</h1>
    <p class="hero-desc">✦ 欢迎来到这片森林 ✦</p>
  </section>

  <section class="entries">
    <div v-for="e in entries" :key="e.id" class="entry-card" @click="router.push(`/${e.id}`)">
      <span class="entry-icon" :style="{ background: e.color }">{{ e.icon }}</span>
      <h2 class="entry-title">{{ e.title }}</h2>
      <p class="entry-desc">{{ e.desc }}</p>
      <span class="entry-arrow">→</span>
    </div>
  </section>
</template>

<style scoped>
.hero { text-align: center; padding: 80px 20px 40px; }
.hero-title { font-size: 3rem; font-weight: 700; color: var(--text); letter-spacing: 2px; }
.hero-desc { font-size: 1.1rem; color: var(--text-light); margin-top: 8px; }
.entries { display: flex; flex-direction: column; gap: 16px; padding-bottom: 80px; }
.entry-card {
  display: flex; align-items: center; gap: 18px; padding: 22px 24px;
  border-radius: 16px; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s;
}
.entry-card:hover { border-color: transparent; box-shadow: 0 4px 24px rgba(0,0,0,0.08); transform: translateX(4px); }
.entry-icon { width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
.entry-title { font-size: 1.3rem; font-weight: 600; color: var(--text); min-width: 70px; }
.entry-desc { flex: 1; font-size: 0.9rem; color: var(--text-light); }
.entry-arrow { font-size: 1.2rem; color: var(--text-light); transition: transform 0.2s; }
.entry-card:hover .entry-arrow { transform: translateX(4px); }
</style>
