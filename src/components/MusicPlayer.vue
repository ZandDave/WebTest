<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const AUDIO_SRC = '/music/Wozwald.mp3'
const LRC_SRC = '/music/Wozwald.lrc'
/** 整首歌词相对音频的偏移（秒）。歌词偏晚用负数，偏早用正数 */
const OFFSET = 0

const audio = ref(null)
const isPlaying = ref(false)
const isHovered = ref(false)
const isTouchPinned = ref(false) // 触屏：点按图标临时展开
const dockMode = ref(false) // true = 底部常驻滚动歌词
const isSeeking = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const currentLine = ref(-1)
const lyrics = ref([])
const lyricsTrack = ref(null)
const lineEls = ref([])
const lineOffset = ref(0)
const scrubberRef = ref(null)

let rafId = 0
let leaveTimer = 0

const isExpanded = computed(
  () => dockMode.value || isHovered.value || isTouchPinned.value || isSeeking.value
)

function parseTime(tag) {
  const m = tag.match(/(\d+):(\d+)(?:\.(\d+))?/)
  if (!m) return 0
  const min = Number(m[1])
  const sec = Number(m[2])
  const frac = m[3] ? Number(m[3].padEnd(3, '0').slice(0, 3)) / 1000 : 0
  return min * 60 + sec + frac
}

function parseLrc(text) {
  const lines = []
  for (const raw of text.split(/\r?\n/)) {
    const matches = [...raw.matchAll(/\[(\d+:\d+(?:\.\d+)?)\]/g)]
    if (!matches.length) continue
    const content = raw.replace(/\[[^\]]*\]/g, '').trim()
    if (!content) continue
    for (const match of matches) {
      lines.push({ time: parseTime(match[1]) + OFFSET, text: content })
    }
  }
  return lines.sort((a, b) => a.time - b.time)
}

function findLineIndex(t) {
  const arr = lyrics.value
  let lo = 0
  let hi = arr.length - 1
  let ans = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid].time <= t) {
      ans = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return ans
}

function applyTime(t) {
  currentTime.value = t
  const line = findLineIndex(t)
  if (line !== currentLine.value) {
    currentLine.value = line
  }
}

function syncFromAudio() {
  if (!audio.value || isSeeking.value) return
  applyTime(audio.value.currentTime)
}

function tick() {
  syncFromAudio()
  if (isPlaying.value) rafId = requestAnimationFrame(tick)
}

function setLineEl(el, i) {
  if (el) lineEls.value[i] = el
}

function updateScrollOffset() {
  const i = currentLine.value
  const el = lineEls.value[i]
  const track = lyricsTrack.value
  if (!el || !track || i < 0) {
    lineOffset.value = 0
    return
  }
  const viewportH = track.parentElement?.clientHeight ?? 72
  lineOffset.value = viewportH / 2 - (el.offsetTop + el.clientHeight / 2)
}

watch(currentLine, async () => {
  await nextTick()
  updateScrollOffset()
})

watch([isExpanded, dockMode], async () => {
  await nextTick()
  updateScrollOffset()
})

function onMouseEnter() {
  if (dockMode.value) return
  clearTimeout(leaveTimer)
  isHovered.value = true
}

function onMouseLeave() {
  if (dockMode.value) return
  leaveTimer = window.setTimeout(() => {
    if (!isSeeking.value) isHovered.value = false
  }, 120)
}

function enterDockMode() {
  dockMode.value = true
  isHovered.value = false
  isTouchPinned.value = false
}

function exitDockMode() {
  dockMode.value = false
}

function toggleDockMode() {
  if (dockMode.value) exitDockMode()
  else enterDockMode()
}

function onFabClick() {
  if (dockMode.value) {
    togglePlay()
    return
  }
  const noHover = window.matchMedia('(hover: none)').matches
  if (noHover) {
    isTouchPinned.value = !isTouchPinned.value
    return
  }
  togglePlay()
}

onMounted(async () => {
  try {
    const res = await fetch(LRC_SRC)
    if (!res.ok) throw new Error('lrc fetch failed')
    lyrics.value = parseLrc(await res.text())
  } catch {
    lyrics.value = [{ time: 0, text: '歌词加载失败' }]
  }
  window.addEventListener('resize', updateScrollOffset)
})

let audioLoading = false

async function ensureAudio() {
  if (audio.value) return
  if (audioLoading) return
  audioLoading = true
  try {
    const response = await fetch(AUDIO_SRC)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    audio.value = new Audio(url)
    audio.value.preload = 'auto'
    audio.value.addEventListener('loadedmetadata', () => {
      duration.value = audio.value.duration
    })
    audio.value.addEventListener('ended', () => {
      isPlaying.value = false
      applyTime(0)
      currentLine.value = -1
      cancelAnimationFrame(rafId)
    })
  } catch (e) {
    console.error('音频加载失败:', e)
  } finally {
    audioLoading = false
  }
}

async function ensureDuration() {
  ensureAudio()
  if (duration.value) return true
  if (audio.value.readyState < 1) {
    await new Promise((resolve) => {
      const onMeta = () => {
        audio.value.removeEventListener('loadedmetadata', onMeta)
        duration.value = audio.value.duration
        resolve()
      }
      audio.value.addEventListener('loadedmetadata', onMeta)
      audio.value.load()
    })
  } else {
    duration.value = audio.value.duration
  }
  return Number.isFinite(duration.value) && duration.value > 0
}

function seekToClientX(clientX) {
  const el = scrubberRef.value
  if (!el || !audio.value || !duration.value) return
  const rect = el.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  const t = ratio * duration.value
  audio.value.currentTime = t
  applyTime(t)
}

async function onScrubPointerDown(e) {
  const ok = await ensureDuration()
  if (!ok) return
  isSeeking.value = true
  e.currentTarget.setPointerCapture(e.pointerId)
  seekToClientX(e.clientX)
}

function onScrubPointerMove(e) {
  if (!isSeeking.value) return
  seekToClientX(e.clientX)
}

function onScrubPointerUp(e) {
  if (!isSeeking.value) return
  isSeeking.value = false
  try {
    e.currentTarget.releasePointerCapture(e.pointerId)
  } catch {
    /* already released */
  }
  // 不调用 syncFromAudio()，避免 Cloudflare CDN 不支持 Range 请求
  // 导致 audio.currentTime 未真正跳转而覆盖视觉时间
}

async function togglePlay() {
  await ensureAudio()
  if (!audio.value) return
  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
    cancelAnimationFrame(rafId)
  } else {
    audio.value.play().catch(() => {})
    isPlaying.value = true
    rafId = requestAnimationFrame(tick)
  }
}

function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const progress = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0
)

const currentText = computed(() => {
  if (currentLine.value < 0) return isPlaying.value ? '♪' : '点击播放'
  return lyrics.value[currentLine.value]?.text ?? ''
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  clearTimeout(leaveTimer)
  window.removeEventListener('resize', updateScrollOffset)
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
})
</script>

<template>
  <!-- ===== 底部常驻模式 ===== -->
  <div v-if="dockMode" class="acrylic-dock" :class="{ playing: isPlaying }">
    <div class="acrylic-frame">
      <div class="dock-body">
        <button class="dock-play" @click="togglePlay" :aria-label="isPlaying ? '暂停' : '播放'">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>

        <div class="dock-main">
          <div class="dock-meta">
            <span class="dock-title">ヲズワルド</span>
            <span class="dock-artist">煮ル果実</span>
            <span class="dock-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>

          <div class="lyrics-viewport">
            <div
              class="lyrics-track"
              ref="lyricsTrack"
              :style="{ transform: `translateY(${lineOffset}px)` }"
            >
              <p
                v-for="(line, i) in lyrics"
                :key="'d-' + i"
                :ref="(el) => setLineEl(el, i)"
                :class="[
                  'lyric-line',
                  {
                    active: i === currentLine,
                    past: i < currentLine,
                    next: i === currentLine + 1,
                  },
                ]"
              >
                {{ line.text }}
              </p>
            </div>
            <div v-if="currentLine < 0" class="lyrics-placeholder">{{ currentText }}</div>
          </div>

          <div class="scrubber-row">
            <span class="scrub-time">{{ formatTime(currentTime) }}</span>
            <div
              ref="scrubberRef"
              class="scrubber"
              :class="{ seeking: isSeeking }"
              role="slider"
              :aria-valuemin="0"
              :aria-valuemax="duration || 0"
              :aria-valuenow="currentTime"
              tabindex="0"
              @pointerdown.prevent="onScrubPointerDown"
              @pointermove="onScrubPointerMove"
              @pointerup="onScrubPointerUp"
              @pointercancel="onScrubPointerUp"
            >
              <div class="scrubber-track">
                <div class="scrubber-fill" :style="{ width: progress + '%' }"></div>
                <div class="scrubber-thumb" :style="{ left: progress + '%' }"></div>
              </div>
            </div>
            <span class="scrub-time">{{ formatTime(duration) }}</span>
          </div>
        </div>

        <button
          class="mode-btn"
          @click="exitDockMode"
          title="恢复悬停模式"
          aria-label="恢复悬停模式"
        >
          📌
        </button>
      </div>
    </div>
  </div>

  <!-- ===== 悬停模式 ===== -->
  <div
    v-else
    class="music-player"
    :class="{ expanded: isExpanded, playing: isPlaying }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <Transition name="panel">
      <div v-if="isExpanded" class="acrylic-panel">
        <div class="acrylic-frame">
          <div class="dock-body">
            <button
              class="dock-play"
              @click="togglePlay"
              :aria-label="isPlaying ? '暂停' : '播放'"
            >
              {{ isPlaying ? '⏸' : '▶' }}
            </button>

            <div class="dock-main">
              <div class="dock-meta">
                <span class="dock-title">ヲズワルド</span>
                <span class="dock-artist">煮ル果実</span>
                <span class="dock-time">
                  {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                </span>
              </div>

              <div class="lyrics-viewport">
                <div
                  class="lyrics-track"
                  ref="lyricsTrack"
                  :style="{ transform: `translateY(${lineOffset}px)` }"
                >
                  <p
                    v-for="(line, i) in lyrics"
                    :key="'h-' + i"
                    :ref="(el) => setLineEl(el, i)"
                    :class="[
                      'lyric-line',
                      {
                        active: i === currentLine,
                        past: i < currentLine,
                        next: i === currentLine + 1,
                      },
                    ]"
                  >
                    {{ line.text }}
                  </p>
                </div>
                <div v-if="currentLine < 0" class="lyrics-placeholder">
                  {{ currentText }}
                </div>
              </div>

              <div class="scrubber-row">
                <span class="scrub-time">{{ formatTime(currentTime) }}</span>
                <div
                  ref="scrubberRef"
                  class="scrubber"
                  :class="{ seeking: isSeeking }"
                  role="slider"
                  :aria-valuemin="0"
                  :aria-valuemax="duration || 0"
                  :aria-valuenow="currentTime"
                  tabindex="0"
                  @pointerdown.prevent="onScrubPointerDown"
                  @pointermove="onScrubPointerMove"
                  @pointerup="onScrubPointerUp"
                  @pointercancel="onScrubPointerUp"
                >
                  <div class="scrubber-track">
                    <div class="scrubber-fill" :style="{ width: progress + '%' }"></div>
                    <div class="scrubber-thumb" :style="{ left: progress + '%' }"></div>
                  </div>
                </div>
                <span class="scrub-time">{{ formatTime(duration) }}</span>
              </div>
            </div>

            <button
              class="mode-btn"
              @click="enterDockMode"
              title="固定到底部滚动歌词"
              aria-label="固定到底部滚动歌词"
            >
              📍
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <button
      class="player-fab"
      @click="onFabClick"
      :title="isPlaying ? '播放中 · 悬停查看歌词' : '悬停查看 / 点击播放'"
    >
      <span class="fab-icon">🎵</span>
    </button>
  </div>
</template>

<style scoped>
@font-face {
  font-family: '851ShouShu';
  src: url('/fonts/851ShouShu-subset.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

/* —— 悬停模式：右下角 —— */
.music-player {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
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
  flex-shrink: 0;
}
.music-player:hover .player-fab,
.music-player.expanded .player-fab {
  transform: scale(1.06);
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.45);
}
.music-player.playing .fab-icon {
  animation: musicPulse 2s ease-in-out infinite;
}
@keyframes musicPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.acrylic-panel {
  width: min(420px, calc(100vw - 48px));
}

.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

/* —— 底部常驻模式 —— */
.acrylic-dock {
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 1000;
  width: min(720px, calc(100vw - 32px));
  animation: dockIn 0.35s ease;
}
@keyframes dockIn {
  from { opacity: 0; transform: translateX(-50%) translateY(16px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.acrylic-frame {
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(22px) saturate(1.4);
  -webkit-backdrop-filter: blur(22px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.65);
  box-shadow:
    0 8px 32px rgba(15, 23, 42, 0.12),
    0 1px 0 rgba(255, 255, 255, 0.8) inset,
    0 -1px 0 rgba(15, 23, 42, 0.04) inset;
}
.music-player.playing .acrylic-frame,
.acrylic-dock.playing .acrylic-frame {
  border-color: rgba(59, 130, 246, 0.35);
  box-shadow:
    0 10px 36px rgba(59, 130, 246, 0.18),
    0 1px 0 rgba(255, 255, 255, 0.85) inset;
}

.dock-body {
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 12px 14px 14px;
}

.dock-play {
  flex-shrink: 0;
  align-self: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: var(--accent);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
  transition: transform 0.15s, opacity 0.15s;
}
.dock-play:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.mode-btn {
  flex-shrink: 0;
  align-self: flex-start;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.15s;
}
.mode-btn:hover {
  background: rgba(15, 23, 42, 0.08);
  transform: scale(1.08);
}

.dock-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dock-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 0.72rem;
  color: var(--text-light);
  padding: 0 2px;
}
.dock-title {
  font-weight: 600;
  color: var(--text);
  font-size: 0.78rem;
}
.dock-artist {
  opacity: 0.8;
}
.dock-time {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  opacity: 0.75;
}

.lyrics-viewport {
  position: relative;
  height: 72px;
  overflow: hidden;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06);
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    #000 18%,
    #000 82%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    #000 18%,
    #000 82%,
    transparent 100%
  );
}

.lyrics-track {
  will-change: transform;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
  padding: 0 16px;
}

.lyric-line {
  margin: 0;
  padding: 6px 0;
  text-align: center;
  font-family: '851ShouShu', var(--sans);
  font-size: 0.95rem;
  line-height: 1.45;
  color: rgba(26, 26, 46, 0.35);
  transition:
    color 0.35s ease,
    font-size 0.35s ease,
    opacity 0.35s ease,
    transform 0.35s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lyric-line.past {
  color: rgba(26, 26, 46, 0.28);
}
.lyric-line.next {
  color: rgba(26, 26, 46, 0.5);
}
.lyric-line.active {
  color: var(--accent);
  font-size: 1.12rem;
  transform: scale(1.02);
}

.lyrics-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: '851ShouShu', var(--sans);
  font-size: 0.95rem;
  color: var(--text-light);
  opacity: 0.7;
  pointer-events: none;
}

.scrubber-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 2px 0;
  position: relative;
  z-index: 1;
}
.scrub-time {
  font-size: 0.68rem;
  color: var(--text-light);
  font-variant-numeric: tabular-nums;
  min-width: 30px;
}
.scrub-time:last-child {
  text-align: right;
}

.scrubber {
  flex: 1;
  height: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  touch-action: none;
  user-select: none;
}
.scrubber-track {
  position: relative;
  width: 100%;
  height: 4px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.12);
}
.scrubber-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), #60a5fa);
  transition: width 0.08s linear;
}
.scrubber.seeking .scrubber-fill {
  transition: none;
}
.scrubber-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  margin-left: -6px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid var(--accent);
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.2);
  transform: translateY(-50%) scale(0.85);
  transition: transform 0.15s ease, left 0.08s linear;
  pointer-events: none;
}
.scrubber.seeking .scrubber-thumb,
.scrubber:hover .scrubber-thumb {
  transform: translateY(-50%) scale(1);
  transition: transform 0.15s ease, left 0s;
}
.scrubber.seeking .scrubber-thumb {
  transition: none;
}

@media (max-width: 640px) {
  .music-player {
    bottom: 16px;
    right: 16px;
  }
  .acrylic-panel {
    width: min(340px, calc(100vw - 32px));
  }
  .acrylic-dock {
    bottom: 12px;
    width: calc(100vw - 20px);
  }
  .dock-body {
    padding: 10px 10px 12px;
    gap: 8px;
  }
  .dock-play {
    width: 38px;
    height: 38px;
  }
  .lyrics-viewport {
    height: 64px;
  }
  .lyric-line {
    font-size: 0.88rem;
  }
  .lyric-line.active {
    font-size: 1.02rem;
  }
  .dock-artist,
  .dock-time {
    display: none;
  }
}
</style>
