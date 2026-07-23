<script setup>
</script>

<template>
  <section class="about-page">
    <h1 class="about-title">关于我</h1>

    <div class="about-card">
      <div class="avatar">森</div>
      <h2>森林</h2>
      <p class="role">前端开发工程师</p>
      <p class="bio">
        热爱前端技术，专注于构建优雅、高性能的用户界面。<br />
        喜欢探索新技术，乐于分享开发经验。
      </p>
    </div>

    <div class="skills">
      <h3>技术栈</h3>
      <div class="skill-tags">
        <span>Vue.js</span>
        <span>React</span>
        <span>TypeScript</span>
        <span>Node.js</span>
        <span>CSS/SCSS</span>
        <span>Vite</span>
        <span>Git</span>
      </div>
    </div>

    <div class="contact">
      <h3>联系方式</h3>
      <p>
        📧 Email：<a href="mailto:example@scz.com">example@scz.com</a><br />
        💻 GitHub：<a href="https://github.com" target="_blank">github.com/SCZ</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
.about-page {
  padding: 40px 0 80px;
}
.about-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 40px;
  text-align: center;
}
.about-card {
  text-align: center;
  padding: 48px 24px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  margin-bottom: 40px;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  font-size: 1.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.about-card h2 {
  font-size: 1.5rem;
  color: var(--text);
  margin-bottom: 8px;
}
.role {
  color: var(--accent);
  font-weight: 500;
  margin-bottom: 16px;
}
.bio {
  color: var(--text-light);
  line-height: 1.8;
}
.skills, .contact {
  margin-bottom: 40px;
}
.skills h3, .contact h3 {
  font-size: 1.2rem;
  color: var(--text);
  margin-bottom: 16px;
}
.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.skill-tags span {
  padding: 6px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--text-light);
}
.contact p {
  color: var(--text-light);
  line-height: 2;
}
.contact a {
  color: var(--accent);
  text-decoration: none;
}
.contact a:hover {
  text-decoration: underline;
}
</style>
