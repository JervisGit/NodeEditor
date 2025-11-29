<template>
  <div 
    class="tree-item"
    :style="{ paddingLeft: (item.depth * 16 + 12) + 'px' }"
  >
    <div 
      class="item-content"
      :class="{ 
        active: item.type === 'file' && item.path === current,
        clickable: item.type === 'file'
      }"
      @click="handleClick"
      @contextmenu.prevent="$emit('contextmenu', $event)"
    >
      <!-- Folder chevron -->
      <svg 
        v-if="item.type === 'folder'" 
        class="chevron"
        :class="{ expanded: item.expanded }"
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="currentColor"
        @click.stop="$emit('toggle')"
      >
        <path d="M6 4l4 4-4 4V4z"/>
      </svg>
      <span v-else class="spacer"></span>
      
      <!-- Icon -->
      <svg 
        v-if="item.type === 'folder'" 
        class="icon folder-icon"
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="currentColor"
      >
        <path d="M14.5 2H7.71l-.85-.85L6.51 1h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 2zm-.51 8.49V13h-12V7h4.49l.35-.15.86-.86H14v1.5z"/>
      </svg>
      <svg 
        v-else
        class="icon file-icon"
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="currentColor"
        :style="{ color: getFileColor(item.name) }"
      >
        <path d="M13.85 4.44l-3.28-3.3-.35-.14H2.5l-.5.5v13l.5.5h11l.5-.5V4.8l-.15-.36zM13 14H3V2h6v3.5l.5.5H13v8z"/>
      </svg>
      
      <span class="name">{{ item.name }}</span>
      
      <button 
        v-if="item.type === 'file'" 
        @click.stop="$emit('delete')" 
        class="delete-btn" 
        title="Delete"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FileItem {
  name: string
  path: string
  type: 'file' | 'folder'
  depth: number
  expanded?: boolean
}

const props = defineProps<{
  item: FileItem
  current: string | null
  expanded: Set<string>
}>()

const emit = defineEmits<{
  click: []
  toggle: []
  delete: []
  contextmenu: [event: MouseEvent]
}>()

const handleClick = () => {
  if (props.item.type === 'file') {
    emit('click')
  } else {
    emit('toggle')
  }
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
.tree-item {
  position: relative;
}

.item-content {
  display: flex;
  align-items: center;
  padding: 4px 12px 4px 0;
  gap: 6px;
  min-height: 22px;
  font-size: 13px;
  color: #cccccc;
  transition: background 0.05s ease;
}

.item-content.clickable {
  cursor: pointer;
}

.item-content:hover {
  background: #2a2d2e;
}

.item-content.active {
  background: #37373d;
  color: #ffffff;
}

.chevron {
  flex-shrink: 0;
  transition: transform 0.15s ease;
  cursor: pointer;
  opacity: 0.8;
}

.chevron.expanded {
  transform: rotate(90deg);
}

.icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.folder-icon {
  color: #dcb67a;
}

.spacer {
  width: 16px;
  flex-shrink: 0;
}

.name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 400;
  line-height: 22px;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #858585;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 22px;
  height: 22px;
  line-height: 1;
  display: none;
  border-radius: 5px;
  transition: all 0.1s ease;
  margin-left: auto;
}

.item-content:hover .delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #2a2d2e;
  color: #f48771;
}
</style>
