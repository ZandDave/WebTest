<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const audio = ref(null)
const isPlaying = ref(false)
const isExpanded = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentLine = ref(-1)

// 歌词数据（时间戳单位：秒）
const lyrics = [
  { time: 0,   text: '🎵 音乐起...' },
  { time: 5,   text: '还记得你说家是唯一的城堡' },
  { time: 10,  text: '随着稻香河流继续奔跑' },
  { time: 15,  text: '微微笑 小时候的梦我知道' },
  { time: 20,  text: '不要哭让萤火虫带着你逃跑' },
  { time: 25,  text: '乡间的歌谣永远的依靠' },
  { time: 30,  text: '回家吧 回到最初的美好' },
  { time: 35,  text: '不要这么容易就想放弃' },
  { time: 40,  text: '就像我说的' },
  { time: 45,  text: '追不到的梦想 换个梦不就得了' },
  { time: 50,  text: '为自己的人生鲜艳上色' },
  { time: 55,  text: '先把爱涂上喜欢的颜色' },
  { time: 60,  text: '笑一个吧 功成名就不是目的' },
  { time: 65,  text: '让自己快乐快乐这才叫做意义' },
  { time: 70,  text: '童年的纸飞机' },
  { time: 75,  text: '现在终于飞回我手里' },
  { time: 80,  text: '🎵 感谢聆听 ~' },
]

const progress = computed(() => {
  if (!duration.value) return 0
  return (currentTime.value / duration.value) * 100
})

const lyricsRef = ref(null)

function togglePlay() {
  if (!audio.value) {
    audio.value = new Audio('/music/song.mp3')
    audio.value.addEventListener('timeupdate', onTimeUpdate)
    audio.value.addEventListener('loadedmetadata', () => {
      duration.value = audio.value.duration
    })
    audio.value.addEventListener('ended', () => {
      isPlaying.value = false
      currentTime.value = 0
      currentLine.value = -1
    })
  }

  if (isPlaying.value) {
    audio.value.pause()
  } else {
    audio.value.play().catch(() => {
      // 本地文件不存在时，尝试在线音乐
      audio.value.src = 'https://music.163.com/#/song?id=1396524585'
      audio.value.play().catch(() => {})
    })
  }
  isPlaying.value = !isPlaying.value
}

function onTimeUpdate() {
  if (!audio.value) return
  currentTime.value = audio.value.currentTime

  // 查找当前歌词行
  let line = -1
  for (let i = lyrics.length - 1; i >= 0; i--) {
    if (currentTime.value >= lyrics[i].time) {
      line = i
      break
    }
  }
  currentLine.value = line
}

function onSeek(e) {
  if (!audio.value || !duration.value) return
  const rect = e.target.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  audio.value.currentTime = ratio * duration.value
}

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})
</script>

<template>
  <div :class="['music-player', { expanded: isExpanded }]">
    <!-- 收起状态：浮动按钮 -->
    <button v-if="!isExpanded" class="player-fab" @click="toggleExpand" title="打开音乐播放器">
      <span class="fab-icon">🎵</span>
    </button>

    <!-- 展开状态：播放器卡片 -->
    <div v-else class="player-card">
      <div class="player-header">
        <span class="player-title">🎵 ヲズワルド - 煮ル果実</span>
        <button class="player-close" @click="toggleExpand">✕</button>
      </div>

      <!-- 播放/暂停 -->
      <div class="player-controls">
        <button class="play-btn" @click="togglePlay">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>
        <div class="progress-wrap">
          <span class="time">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar" @click="onSeek">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="time">{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 歌词区域 -->
      <div class="lyrics-wrap" ref="lyricsRef">
        <p
          v-for="(line, i) in lyrics"
          :key="i"
          :class="['lyric-line', { active: i === currentLine, past: i < currentLine }]"
        >
          {{ line.text }}
        </p>
        <p v-if="!audio || (!isPlaying && currentTime === 0)" class="lyric-hint">
          点击播放按钮开始
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.music-player {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.player-fab {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.player-fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.45);
}
.fab-icon {
  animation: musicPulse 2s ease-in-out infinite;
}
@keyframes musicPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.player-card {
  width: 300px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  animation: slideUp 0.3s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 10px;
}
.player-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}
.player-close {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 1rem;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s;
}
.player-close:hover {
  background: var(--card-bg);
}

.player-controls {
  padding: 0 16px 12px;
}
.play-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 10px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-btn:hover {
  opacity: 0.85;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.time {
  font-size: 0.7rem;
  color: var(--text-light);
  min-width: 28px;
  font-variant-numeric: tabular-nums;
}
.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  cursor: pointer;
  position: relative;
}
.progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.2s linear;
}

.lyrics-wrap {
  max-height: 200px;
  overflow-y: auto;
  padding: 0 16px 16px;
  scroll-behavior: smooth;
}
.lyric-line {
  font-size: 0.82rem;
  color: var(--text-light);
  padding: 5px 0;
  transition: color 0.3s, font-size 0.3s;
  line-height: 1.5;
}
.lyric-line.active {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
}
.lyric-line.past {
  color: var(--border);
}
.lyric-hint {
  font-size: 0.78rem;
  color: var(--text-light);
  opacity: 0.6;
  text-align: center;
  padding: 20px 0;
}

/* 滚动条美化 */
.lyrics-wrap::-webkit-scrollbar {
  width: 3px;
}
.lyrics-wrap::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

@media (max-width: 640px) {
  .player-card {
    width: 280px;
  }
  .music-player {
    bottom: 16px;
    right: 16px;
  }
}
</style>
