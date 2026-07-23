<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const selected = ref(null)

const characters = [
  { id: 'akira', name: '明', role: '主角', avatar: '🌙', desc: '沉默寡言的少年，拥有看见「影」的能力。', detail: '年龄：17\n身高：175cm\n能力：洞察影之隙\n背景：从小生活在森林边缘的村庄，某天在森林深处遭遇了改变命运的相遇...' },
  { id: 'yuki', name: '雪', role: '同伴', avatar: '❄️', desc: '来历不明的白发少女，总是带着神秘的微笑。', detail: '年龄：不详（外表约16）\n身高：158cm\n能力：操纵冰霜\n背景：在森林暴风雪中被发现，失去了所有记忆...' },
  { id: 'ren', name: '莲', role: '引导者', avatar: '🪷', desc: '森林深处的隐士，知晓古老秘密。', detail: '年龄：外表约25\n能力：与自然对话\n背景：守护森林入口的最后一个传人...' },
  { id: 'kage', name: '影', role: '反派', avatar: '🖤', desc: '来自暗影位面的存在，以恐惧为食。', detail: '本质：远古暗影碎片\n目的：吞噬森林的光\n弱点：纯粹的善意之光...' }
]
</script>

<template>
  <div class="characters-page">
    <router-link to="/" class="back-link">← 返回首页</router-link>
    <h1 class="page-title">人物设定</h1>
    <p class="page-desc">点击卡片展开详细信息</p>

    <div v-if="!selected" class="char-grid">
      <div
        v-for="char in characters" :key="char.id"
        class="char-card"
        @click="selected = char"
      >
        <span class="char-avatar">{{ char.avatar }}</span>
        <h3>{{ char.name }}</h3>
        <span class="char-role" :style="{ color: char.id === 'kage' ? '#ef4444' : '#8b5cf6' }">{{ char.role }}</span>
        <p class="char-desc">{{ char.desc }}</p>
      </div>
    </div>

    <div v-else class="char-detail">
      <button class="back-btn" @click="selected = null">← 返回列表</button>
      <div class="detail-header">
        <span class="detail-avatar">{{ selected.avatar }}</span>
        <div>
          <h2>{{ selected.name }}</h2>
          <span class="detail-role">{{ selected.role }}</span>
        </div>
      </div>
      <pre class="detail-text">{{ selected.detail }}</pre>
    </div>
  </div>
</template>

<style scoped>
.characters-page { padding: 32px 0 80px; }
.back-link, .back-btn { background: none; border: none; color: var(--accent); cursor: pointer; font-size: 0.95rem; padding: 0; text-decoration: none; display: inline-block; margin-bottom: 20px; }
.back-link:hover, .back-btn:hover { opacity: 0.7; }
.page-title { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
.page-desc { color: var(--text-light); margin-bottom: 32px; }

.char-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.char-card { padding: 24px; border: 1px solid var(--border); border-radius: 16px; cursor: pointer; transition: all 0.2s; text-align: center; }
.char-card:hover { border-color: #8b5cf6; box-shadow: 0 4px 20px rgba(139,92,246,0.1); }
.char-avatar { font-size: 2.5rem; display: block; margin-bottom: 12px; }
.char-card h3 { font-size: 1.2rem; margin-bottom: 4px; }
.char-role { font-size: 0.8rem; font-weight: 500; }
.char-desc { font-size: 0.88rem; color: var(--text-light); margin-top: 10px; line-height: 1.6; }

.char-detail { }
.detail-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.detail-avatar { font-size: 3rem; }
.detail-header h2 { font-size: 1.6rem; }
.detail-role { font-size: 0.85rem; color: var(--text-light); }
.detail-text { font-family: var(--sans); white-space: pre-wrap; line-height: 1.8; background: var(--card-bg); padding: 20px; border-radius: 12px; border: 1px solid var(--border); font-size: 0.95rem; color: var(--text); }
</style>
