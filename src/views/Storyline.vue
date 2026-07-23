<script setup>
const events = [
  { year: '远古', title: '森林诞生', desc: '世界树从混沌中苏醒，第一片森林覆盖大地。', link: '' },
  { year: '约1000年前', title: '影之裂隙', desc: '暗影位面首次与现世接触，远古守护者封印裂隙。', link: '' },
  { year: '约300年前', title: '村庄建立', desc: '逃离战乱的人们在森林边缘建立第一个定居点。', link: '' },
  { year: '约50年前', title: '守护者传承', desc: '莲继承了守护森林入口的使命。', link: '' },
  { year: '10年前', title: '暴风雪之夜', desc: '雪在森林暴风雪中被发现，失去所有记忆。', link: '' },
  { year: '现在', title: '故事的开始', desc: '明在森林深处遭遇改变命运的相遇...', link: '' },
]
</script>

<template>
  <div class="storyline-page">
    <router-link to="/" class="back-link">← 返回首页</router-link>
    <h1 class="page-title">故事线</h1>
    <p class="page-desc">世界观时间线</p>

    <div class="timeline">
      <div v-for="(e, i) in events" :key="i" class="tl-item">
        <div class="tl-dot"></div>
        <div v-if="i < events.length - 1" class="tl-line"></div>
        <div class="tl-content">
          <span class="tl-year">{{ e.year }}</span>
          <h3>{{ e.title }}</h3>
          <p>{{ e.desc }}</p>
          <a v-if="e.link" :href="e.link" class="tl-link" target="_blank">查看详情 →</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.storyline-page { padding: 32px 0 80px; }
.back-link { background: none; border: none; color: var(--accent); cursor: pointer; font-size: 0.95rem; padding: 0; text-decoration: none; display: inline-block; margin-bottom: 20px; }
.back-link:hover { opacity: 0.7; }
.page-title { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
.page-desc { color: var(--text-light); margin-bottom: 40px; }

.timeline { position: relative; padding-left: 32px; }
.tl-item { position: relative; padding-bottom: 32px; }
.tl-dot {
  position: absolute; left: -27px; top: 4px;
  width: 12px; height: 12px; border-radius: 50%;
  background: var(--accent); border: 2px solid #fff;
  box-shadow: 0 0 0 1px var(--accent);
}
.tl-line {
  position: absolute; left: -22px; top: 20px;
  width: 2px; height: calc(100% - 4px);
  background: var(--border);
}
.tl-content { }
.tl-year { font-size: 0.78rem; color: var(--accent); font-weight: 600; }
.tl-content h3 { font-size: 1.1rem; margin: 4px 0; }
.tl-content p { font-size: 0.9rem; color: var(--text-light); line-height: 1.6; }
.tl-link { font-size: 0.85rem; color: var(--accent); text-decoration: none; display: inline-block; margin-top: 6px; }
.tl-link:hover { text-decoration: underline; }
</style>
