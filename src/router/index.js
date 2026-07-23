import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Characters from '../views/Characters.vue'
import Storyline from '../views/Storyline.vue'
import Archive from '../views/Archive.vue'
import About from '../views/About.vue'
import Post from '../views/Post.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/characters', name: 'Characters', component: Characters },
  { path: '/storyline', name: 'Storyline', component: Storyline },
  { path: '/archive', name: 'Archive', component: Archive },
  { path: '/about', name: 'About', component: About },
  { path: '/post/:id', name: 'Post', component: Post },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
