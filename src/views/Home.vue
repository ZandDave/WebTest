<script setup>
</script>

<template>
  <section class="hero">
    <h1 class="hero-title">森林 🌲</h1>
    <p class="hero-desc">
      一名前端开发者，热爱技术、设计与写作。<br/>
      这里记录我的学习笔记与思考。
    </p>
  </section>

  <section class="posts-section">
    <p class="empty-tip">还没有文章，敬请期待 ~</p>
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
.empty-tip {
  text-align: center;
  color: var(--text-light);
  padding: 40px 0;
}
</style>
