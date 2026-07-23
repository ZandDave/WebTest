<script setup>
import { ref, computed } from 'vue'
import PostCard from '../components/PostCard.vue'
import postsData from '../data/posts.json'

const posts = ref(postsData)
const activeTag = ref('全部')

const tags = computed(() => {
  const set = new Set(postsData.map(p => p.tag))
  return ['全部', ...set]
})

const filteredPosts = computed(() => {
  if (activeTag.value === '全部') return posts.value
  return posts.value.filter(p => p.tag === activeTag.value)
})
</script>

<template>
  <section class="hero">
    <h1 class="hero-title">嗨，我是 SCZ 👋</h1>
    <p class="hero-desc">
      一名前端开发者，热爱技术、设计与写作。<br/>
      这里记录我的学习笔记与思考。
    </p>
  </section>

  <section class="posts-section">
    <div class="tag-filter">
      <button
        v-for="tag in tags"
        :key="tag"
        :class="['tag-btn', { active: activeTag === tag }]"
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <div class="post-list">
      <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
    </div>

    <p v-if="filteredPosts.length === 0" class="empty-tip">暂无该标签的文章。</p>
  </section>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 80px 20px 60px;
}
.hero-title {
  font-size: 2.8rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}
.hero-desc {
  font-size: 1.15rem;
  color: var(--text-light);
  line-height: 1.8;
}
.tag-filter {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}
.tag-btn {
  padding: 6px 18px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: transparent;
  color: var(--text-light);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.tag-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}
.tag-btn.active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.empty-tip {
  text-align: center;
  color: var(--text-light);
  padding: 40px 0;
}
</style>
