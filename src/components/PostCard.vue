<script setup>
import { useRouter } from 'vue-router'

defineProps({
  post: { type: Object, required: true }
})

const router = useRouter()
</script>

<template>
  <article class="post-card" @click="router.push(`/post/${post.id}`)">
    <div class="card-meta">
      <span class="card-tag">{{ post.tag }}</span>
      <time class="card-date">{{ post.date }}</time>
    </div>
    <h2 class="card-title">{{ post.title }}</h2>
    <p class="card-excerpt">{{ post.excerpt }}</p>
    <span class="card-link">阅读全文 →</span>
  </article>
</template>

<style scoped>
.post-card {
  padding: 28px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
}
.post-card:hover {
  padding-left: 12px;
}
.post-card:hover .card-link {
  color: var(--accent);
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}
.card-tag {
  font-size: 0.78rem;
  color: var(--accent);
  background: var(--accent-light);
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 500;
}
.card-date {
  font-size: 0.85rem;
  color: var(--text-light);
}
.card-title {
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.4;
}
.card-excerpt {
  font-size: 0.95rem;
  color: var(--text-light);
  line-height: 1.7;
  margin-bottom: 10px;
}
.card-link {
  font-size: 0.88rem;
  color: var(--text-light);
  transition: color 0.2s;
}
</style>
