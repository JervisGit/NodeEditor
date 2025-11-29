<template>
  <div v-if="output" class="output-panel">
    <div class="output-header">
      <span>OUTPUT</span>
      <button @click="$emit('clear')" class="clear-btn">Clear</button>
    </div>
    <pre class="output-content">{{ output }}</pre>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  output: string
}>()

defineEmits<{
  clear: []
}>()
</script>

<style scoped>
.output-panel {
  height: 200px;
  background: #1e1e1e;
  border-top: 1px solid #3e3e42;
  display: flex;
  flex-direction: column;
}

.output-header {
  padding: 8px 16px;
  background: #252526;
  border-bottom: 1px solid #3e3e42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  color: #cccccc;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  height: 35px;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #cccccc;
  cursor: pointer;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 3px;
  transition: background 0.15s ease;
  text-transform: none;
  font-weight: 400;
  font-family: inherit;
}

.clear-btn:hover {
  background: #2a2d2e;
}

.output-content {
  flex: 1;
  margin: 0;
  padding: 12px 16px;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  color: #cccccc;
  overflow-y: auto;
  white-space: pre-wrap;
  line-height: 1.6;
  background: #1e1e1e;
}

.output-content::-webkit-scrollbar {
  width: 10px;
}

.output-content::-webkit-scrollbar-track {
  background: transparent;
}

.output-content::-webkit-scrollbar-thumb {
  background: rgba(121, 121, 121, 0.4);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.output-content::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 100, 100, 0.7);
  background-clip: padding-box;
}
</style>
