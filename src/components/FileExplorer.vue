<template>
  <div class="file-explorer">
    <div class="explorer-header">
      <h3>EXPLORER</h3>
      <div class="actions">
        <button @click="$emit('newFile')" class="action-btn" title="New File">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.5 1.1l3.4 3.5.1.4v2h-1V6H8V2H3v11h4v1H2.5l-.5-.5v-12l.5-.5h6.7l.3.1zM9 2v3h2.9L9 2zm4 14h-1v-3H9v-1h3V9h1v3h3v1h-3v3z"/>
          </svg>
        </button>
        <button @click="$emit('newFolder')" class="action-btn" title="New Folder">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14.5 2H7.71l-.85-.85L6.51 1h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 2zm-.51 8.49V13h-12V7h4.49l.35-.15.86-.86H14v1.5z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <div class="file-tree">
      <FileTreeItem 
        v-for="item in items" 
        :key="item.path"
        :item="item"
        :current="currentFile"
        :expanded="expandedFolders"
        @click="$emit('openFile', item)"
        @toggle="$emit('toggleFolder', item.path)"
        @delete="$emit('deleteItem', item.path)"
        @contextmenu="$emit('contextmenu', $event, item)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import FileTreeItem from './FileTreeItem.vue'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'folder'
  depth: number
  expanded?: boolean
}

defineProps<{
  items: FileItem[]
  currentFile: string | null
  expandedFolders: Set<string>
}>()

defineEmits<{
  newFile: []
  newFolder: []
  openFile: [item: FileItem]
  toggleFolder: [path: string]
  deleteItem: [path: string]
  contextmenu: [event: MouseEvent, item: FileItem]
}>()
</script>

<style scoped>
.file-explorer {
  width: 300px;
  background: #252526;
  border-right: 1px solid #3e3e42;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.explorer-header {
  padding: 11px 20px;
  background: #252526;
  border-bottom: 1px solid #3e3e42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;
}

.explorer-header h3 {
  margin: 0;
  font-size: 11px;
  font-weight: 700;
  color: #cccccc;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  background: transparent;
  border: none;
  color: #c5c5c5;
  cursor: pointer;
  padding: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  transition: background 0.15s ease;
}

.action-btn:hover {
  background: #2a2d2e;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 4px 0;
}

.file-tree::-webkit-scrollbar {
  width: 10px;
}

.file-tree::-webkit-scrollbar-track {
  background: transparent;
}

.file-tree::-webkit-scrollbar-thumb {
  background: rgba(121, 121, 121, 0.4);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

.file-tree::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 100, 100, 0.7);
  background-clip: padding-box;
}
</style>
