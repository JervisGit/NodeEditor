<template>
  <div class="editor-tabs">
    <div class="tabs-container">
      <div 
        v-for="tab in tabs" 
        :key="tab"
        class="tab"
        :class="{ active: currentTab === tab }"
        @click="$emit('switch', tab)"
      >
        <svg 
          class="tab-icon" 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="currentColor"
          :style="{ color: getFileColor(getFileName(tab)) }"
        >
          <path d="M13.85 4.44l-3.28-3.3-.35-.14H2.5l-.5.5v13l.5.5h11l.5-.5V4.8l-.15-.36zM13 14H3V2h6v3.5l.5.5H13v8z"/>
        </svg>
        <span class="tab-name">{{ getFileName(tab) }}</span>
        <button @click.stop="$emit('close', tab)" class="close-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="toolbar-actions">
      <select v-model="localTheme" @change="$emit('themeChange', localTheme)" class="theme-select">
        <option value="vs">Light</option>
        <option value="vs-dark">Dark</option>
        <option value="hc-black">High Contrast</option>
      </select>
      
      <button @click="$emit('run')" class="run-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4.5 3L13 8l-8.5 5V3z"/>
        </svg>
        Run
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  tabs: string[]
  currentTab: string | null
  theme: string
}>()

const emit = defineEmits<{
  switch: [tab: string]
  close: [tab: string]
  themeChange: [theme: string]
  run: []
}>()

const localTheme = ref(props.theme)

watch(() => props.theme, (newTheme) => {
  localTheme.value = newTheme
})

const getFileName = (path: string): string => {
  return path.split('/').pop() || path
}

const getFileColor = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const colors: Record<string, string> = {
    'js': '#f7df1e',
    'ts': '#3178c6',
    'vue': '#42b883',
    'json': '#f5a623',
    'html': '#e34c26',
    'css': '#264de4',
    'md': '#083fa1'
  }
  return colors[ext || ''] || '#cccccc'
}
</script>

<style scoped>
.editor-tabs {
  background: #252526;
  border-bottom: 1px solid #3e3e42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;
}

.tabs-container {
  display: flex;
  height: 100%;
  overflow-x: auto;
  flex: 1;
}

.tabs-container::-webkit-scrollbar {
  height: 0;
}

.tab {
  padding: 0 14px;
  background: #2d2d2d;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  border-right: 1px solid #252526;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: fit-content;
  max-width: 200px;
  position: relative;
}

.tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: transparent;
  transition: background 0.15s ease;
}

.tab:hover {
  background: #2d2d2d;
  color: rgba(255, 255, 255, 0.85);
}

.tab.active {
  background: #1e1e1e;
  color: #ffffff;
}

.tab.active::before {
  background: #0078d4;
}

.tab-icon {
  flex-shrink: 0;
  opacity: 0.9;
}

.tab-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 400;
}

.close-btn {
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  opacity: 0;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.tab:hover .close-btn,
.tab.active .close-btn {
  opacity: 0.7;
}

.close-btn:hover {
  background: #2a2d2e;
  opacity: 1 !important;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  padding: 0 12px;
  align-items: center;
  flex-shrink: 0;
}

.theme-select {
  padding: 5px 10px;
  background: #3c3c3c;
  border: 1px solid #454545;
  border-radius: 3px;
  color: #cccccc;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s ease;
  font-family: inherit;
}

.theme-select:hover {
  background: #505050;
}

.theme-select:focus {
  outline: 1px solid #0078d4;
}

.run-btn {
  padding: 5px 14px;
  background: #0e639c;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.15s ease;
  font-family: inherit;
}

.run-btn:hover {
  background: #1177bb;
}

.run-btn:active {
  background: #005a9e;
  transform: scale(0.98);
}
</style>
