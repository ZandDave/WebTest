<script setup>
import { ref, computed } from 'vue'

const currentPath = ref([]) // ['文字档案', '章一']

const folders = {
  root: {
    '文字档案': {
      '章一：序章': { '世界观设定.txt': 'content', '角色初稿.txt': 'content' },
      '章二：展开': { '关键场景.txt': 'content', '伏笔记录.txt': 'content' },
      '废稿区': { '旧版大纲.txt': 'content' }
    },
    '图像档案': {
      '角色立绘': { '明_概念图.png': 'image', '雪_初稿.png': 'image' },
      '场景概念': { '森林入口.jpg': 'image', '暗影裂隙.jpg': 'image' },
      '参考素材': {}
    },
    '设定笔记': {
      '魔法体系.txt': 'content',
      '种族设定.txt': 'content',
      '地图草图.png': 'image'
    }
  }
}

function getCurrent() {
  let node = folders.root
  for (const p of currentPath.value) {
    node = node[p]
    if (!node) return {}
  }
  return node
}

const currentItems = computed(() => {
  const items = getCurrent()
  return Object.keys(items).map(name => ({
    name,
    isFolder: typeof items[name] === 'object',
    type: items[name] === 'image' ? '🖼️' : items[name] === 'content' ? '📄' : '📁'
  }))
})

const breadcrumb = computed(() => ['根目录', ...currentPath.value])

function enterFolder(name) {
  currentPath.value = [...currentPath.value, name]
}

function goTo(index) {
  currentPath.value = currentPath.value.slice(0, index)
}

function openFile(name) {
  alert(`打开文件：${name}`)
}
</script>

<template>
  <div class="archive-page">
    <router-link to="/" class="back-link">← 返回首页</router-link>
    <h1 class="page-title">档案室</h1>

    <!-- 面包屑 -->
    <div class="breadcrumb">
      <span v-for="(crumb, i) in breadcrumb" :key="i">
        <span v-if="i > 0" class="crumb-sep"> / </span>
        <button
          :class="['crumb-btn', { active: i === breadcrumb.length - 1 }]"
          @click="goTo(i - 1)"
          :disabled="i === breadcrumb.length - 1"
        >{{ crumb }}</button>
      </span>
    </div>

    <!-- 文件夹视图 -->
    <div class="file-grid">
      <div
        v-for="item in currentItems" :key="item.name"
        class="file-item"
        :class="{ folder: item.isFolder }"
        @click="item.isFolder ? enterFolder(item.name) : openFile(item.name)"
      >
        <span class="file-icon">{{ item.type }}</span>
        <span class="file-name">{{ item.name }}</span>
      </div>
    </div>

    <p v-if="currentItems.length === 0" class="empty">空文件夹</p>
  </div>
</template>

<style scoped>
.archive-page { padding: 32px 0 80px; }
.back-link { background: none; border: none; color: var(--accent); cursor: pointer; font-size: 0.95rem; padding: 0; text-decoration: none; display: inline-block; margin-bottom: 20px; }
.back-link:hover { opacity: 0.7; }
.page-title { font-size: 2rem; font-weight: 700; margin-bottom: 20px; }

.breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; margin-bottom: 24px; font-size: 0.88rem; }
.crumb-sep { color: var(--border); }
.crumb-btn { background: none; border: none; color: var(--text-light); cursor: pointer; padding: 2px 4px; border-radius: 4px; }
.crumb-btn:hover:not(:disabled) { background: var(--card-bg); color: var(--text); }
.crumb-btn.active { color: var(--text); font-weight: 600; }

.file-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
.file-item {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 20px 12px; border-radius: 12px;
  border: 1px solid var(--border); cursor: pointer;
  transition: all 0.2s; text-align: center;
}
.file-item:hover { border-color: var(--accent); background: var(--card-bg); }
.file-item.folder:hover { border-color: #e6a817; }
.file-icon { font-size: 2rem; }
.file-name { font-size: 0.82rem; color: var(--text); line-height: 1.3; word-break: break-all; }

.empty { text-align: center; color: var(--text-light); padding: 40px; }
</style>
