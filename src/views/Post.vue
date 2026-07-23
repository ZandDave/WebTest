<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import postsData from '../data/posts.json'

const route = useRoute()
const router = useRouter()

const post = computed(() => {
  return postsData.find(p => p.id === Number(route.params.id))
})

// 简单的 Markdown 转 HTML（支持标题、代码块、段落、列表、链接）
function renderMarkdown(md) {
  if (!md) return ''
  let html = md
    // 代码块 ```
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // 行内代码 `...`
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 标题
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 加粗
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // 无序列表
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // 有序列表
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // 段落（连续非空行）
    .replace(/\n\n/g, '</p><p>')
    // 单换行
    .replace(/\n/g, '<br/>')

  html = '<p>' + html + '</p>'
  // 把连续的 <li> 包进 <ul>
  html = html.replace(/(<li>.*?<\/li>(?:<br\/>)?)+/g, '<ul>$&</ul>')
  // 清理多余的 <br/>
  html = html.replace(/<br\/>/g, '')
  html = html.replace(/<\/ul><br\/>/g, '</ul>')
  html = html.replace(/<\/pre><br\/>/g, '</pre>')
  html = html.replace(/<\/h[1-4]><br\/>/g, (m) => m.replace('<br/>', ''))

  return html
}

const renderedContent = computed(() => renderMarkdown(post.value?.content || ''))
</script>

<template>
  <article v-if="post" class="post-detail">
    <button class="back-btn" @click="router.push('/')">← 返回首页</button>

    <header class="post-header">
      <span class="post-tag">{{ post.tag }}</span>
      <h1 class="post-title">{{ post.title }}</h1>
      <time class="post-date">{{ post.date }}</time>
    </header>

    <div class="post-body" v-html="renderedContent"></div>
  </article>

  <div v-else class="not-found">
    <p>文章不存在 😕</p>
    <button class="back-btn" @click="router.push('/')">← 返回首页</button>
  </div>
</template>

<style scoped>
.post-detail {
  padding: 40px 0 80px;
}
.back-btn {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 32px;
  transition: opacity 0.2s;
}
.back-btn:hover {
  opacity: 0.7;
}
.post-header {
  margin-bottom: 48px;
}
.post-tag {
  display: inline-block;
  background: var(--accent-light);
  color: var(--accent);
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 16px;
}
.post-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}
.post-date {
  color: var(--text-light);
  font-size: 0.95rem;
}
.not-found {
  text-align: center;
  padding: 100px 20px;
  color: var(--text-light);
}
</style>
