<template>
  <div class="file-explorer-demo">
    <h1>File Explorer</h1>
    <p class="description">A GitHub-style file browser for exploring project structure and viewing file contents</p>
    
    <div class="explorer-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>Files</h3>
          <button @click="toggleAllFolders" class="toggle-btn" :title="allExpanded ? 'Collapse All' : 'Expand All'">
            <svg v-if="allExpanded" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9 9H4v1h5V9z"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 7v1H8v6H7V8H1V7h6V1h1v6h6z"/>
            </svg>
          </button>
        </div>
        
        <div class="file-tree">
          <div 
            v-for="item in fileTree" 
            :key="item.path"
            class="tree-item"
            :style="{ paddingLeft: (item.depth * 20 + 16) + 'px' }"
            @click="handleItemClick(item)"
          >
            <div class="item-row" :class="{ selected: selectedFile === item.path }">
              <!-- Chevron for folders -->
              <span v-if="item.type === 'folder'" class="chevron" @click.stop="toggleFolder(item.path)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path v-if="expandedFolders.has(item.path)" d="M4 6l4 4 4-4H4z"/>
                  <path v-else d="M6 4l4 4-4 4V4z"/>
                </svg>
              </span>
              <span v-else class="spacer"></span>
              
              <!-- File/Folder Icon -->
              <span class="icon">
                <svg v-if="item.type === 'folder'" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="folder-icon">
                  <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5a.25.25 0 01-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="file-icon" :style="{ color: getFileColor(item.name) }">
                  <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 019 4.25V1.5H3.75a.25.25 0 00-.25.25zm7.75-.188V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013l-2.914-2.914a.272.272 0 00-.013-.011z"/>
                </svg>
              </span>
              
              <span class="name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content Area -->
      <div class="content-area">
        <div v-if="!selectedFile" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor" class="empty-icon">
            <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75zm1.75-.25a.25.25 0 00-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 019 4.25V1.5H3.75a.25.25 0 00-.25.25zm7.75-.188V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013l-2.914-2.914a.272.272 0 00-.013-.011z"/>
          </svg>
          <p>Select a file to view its contents</p>
        </div>
        
        <div v-else class="file-viewer">
          <div class="file-header">
            <div class="breadcrumb">
              <span v-for="(part, index) in getBreadcrumbs(selectedFile)" :key="index" class="breadcrumb-item">
                <span v-if="index > 0" class="separator">/</span>
                <span :class="{ active: index === getBreadcrumbs(selectedFile).length - 1 }">{{ part }}</span>
              </span>
            </div>
            <div class="file-actions">
              <button v-if="!isEditing" @click="startEditing" class="action-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"/>
                </svg>
                Edit
              </button>
              <button v-if="isEditing" @click="saveEdit" class="action-btn save-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                </svg>
                Save
              </button>
              <button v-if="isEditing" @click="cancelEdit" class="action-btn cancel-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
                </svg>
                Cancel
              </button>
              <button class="action-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
                  <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
                </svg>
              </button>
              <button class="action-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                  <path d="M1.5 8a6.5 6.5 0 0113 0 6.5 6.5 0 01-13 0zM8 3.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="file-content">
            <div v-if="!isEditing" class="line-numbers">
              <div v-for="n in getLineCount()" :key="n" class="line-number">{{ n }}</div>
            </div>
            <textarea 
              v-if="isEditing"
              v-model="editContent"
              class="code-editor"
              spellcheck="false"
            ></textarea>
            <pre v-else class="code-content"><code :class="`language-${getLanguage(selectedFile)}`">{{ getFileContent(selectedFile) }}</code></pre>
          </div>
          
          <div class="file-info">
            <span class="info-item">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0113.25 16h-9.5A1.75 1.75 0 012 14.25V1.75z"/>
              </svg>
              {{ getFileName(selectedFile) }}
            </span>
            <span class="info-item">{{ getLineCount() }} lines</span>
            <span class="info-item">{{ getFileSize() }} bytes</span>
            <span class="info-item">{{ getLanguage(selectedFile) }}</span>
            <span v-if="isEditing" class="info-item modified">● Modified</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'folder'
  content?: string
  depth: number
}

const selectedFile = ref<string | null>(null)
const expandedFolders = ref<Set<string>>(new Set(['src', 'src/components', 'public']))
const isEditing = ref(false)
const editContent = ref('')
const originalContent = ref('')

// Sample file system
const files = ref<FileItem[]>([
  { name: 'public', path: 'public', type: 'folder', depth: 0 },
  { name: 'favicon.ico', path: 'public/favicon.ico', type: 'file', depth: 1, content: '// Binary file' },
  { name: 'index.html', path: 'public/index.html', type: 'file', depth: 1, content: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <title>Node Editor Test</title>\n  </head>\n  <body>\n    <div id="app"></div>\n  </body>\n</html>' },
  { name: 'src', path: 'src', type: 'folder', depth: 0 },
  { name: 'App.vue', path: 'src/App.vue', type: 'file', depth: 1, content: 'import { RouterLink, RouterView } from \'vue-router\'\n\n// Main App Component' },
  { name: 'main.ts', path: 'src/main.ts', type: 'file', depth: 1, content: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\nimport router from \'./router\'\n\ncreateApp(App)\n  .use(router)\n  .mount(\'#app\')' },
  { name: 'components', path: 'src/components', type: 'folder', depth: 1 },
  { name: 'FileExplorer.vue', path: 'src/components/FileExplorer.vue', type: 'file', depth: 2, content: '// File Explorer Component\nconst props = defineProps([\n  \'items\',\n  \'currentFile\'\n])\n\n// Styles\n.file-explorer {\n  width: 300px;\n  background: #252526;\n}' },
  { name: 'EditorTabs.vue', path: 'src/components/EditorTabs.vue', type: 'file', depth: 2, content: '// Editor Tabs Component\nconst props = defineProps([\n  \'tabs\',\n  \'currentTab\'\n])' },
  { name: 'package.json', path: 'package.json', type: 'file', depth: 0, content: '{\n  "name": "node-editor-test",\n  "version": "0.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "vue-tsc && vite build"\n  },\n  "dependencies": {\n    "vue": "^3.4.0",\n    "vue-router": "^4.2.0"\n  }\n}' },
  { name: 'README.md', path: 'README.md', type: 'file', depth: 0, content: '# Node Editor Test Project\n\nThis project compares different node editor libraries.\n\n## Features\n\n- Baklava.js\n- Vue Flow  \n- Monaco Editor\n\n## Installation\n\n```bash\nnpm install\n```\n\n## Development\n\n```bash\nnpm run dev\n```' },
  { name: 'tsconfig.json', path: 'tsconfig.json', type: 'file', depth: 0, content: '{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "ESNext",\n    "strict": true\n  },\n  "include": ["src/**/*.ts", "src/**/*.vue"]\n}' }
])

// Build hierarchical file tree
const fileTree = computed(() => {
  return files.value.filter(file => {
    if (file.depth === 0) return true
    
    // Check if all parent folders are expanded
    const pathParts = file.path.split('/')
    for (let i = 1; i < pathParts.length; i++) {
      const parentPath = pathParts.slice(0, i).join('/')
      if (!expandedFolders.value.has(parentPath)) {
        return false
      }
    }
    
    return true
  })
})

const allExpanded = computed(() => {
  const folders = files.value.filter(f => f.type === 'folder')
  return folders.every(f => expandedFolders.value.has(f.path))
})

const toggleFolder = (path: string) => {
  if (expandedFolders.value.has(path)) {
    expandedFolders.value.delete(path)
  } else {
    expandedFolders.value.add(path)
  }
}

const toggleAllFolders = () => {
  if (allExpanded.value) {
    expandedFolders.value.clear()
  } else {
    files.value.filter(f => f.type === 'folder').forEach(f => {
      expandedFolders.value.add(f.path)
    })
  }
}

const handleItemClick = (item: FileItem) => {
  if (item.type === 'file') {
    if (isEditing.value && selectedFile.value) {
      // Save current file before switching
      if (editContent.value !== originalContent.value) {
        const confirmSwitch = confirm('You have unsaved changes. Do you want to discard them?')
        if (!confirmSwitch) return
      }
      isEditing.value = false
    }
    selectedFile.value = item.path
  } else {
    toggleFolder(item.path)
  }
}

const startEditing = () => {
  const content = getFileContent(selectedFile.value!)
  editContent.value = content
  originalContent.value = content
  isEditing.value = true
}

const saveEdit = () => {
  const file = files.value.find(f => f.path === selectedFile.value)
  if (file) {
    file.content = editContent.value
    originalContent.value = editContent.value
  }
  isEditing.value = false
}

const cancelEdit = () => {
  editContent.value = originalContent.value
  isEditing.value = false
}

const getFileContent = (path: string): string => {
  const file = files.value.find(f => f.path === path)
  return file?.content || '// No content available'
}

const getFileName = (path: string): string => {
  return path.split('/').pop() || path
}

const getBreadcrumbs = (path: string): string[] => {
  return path.split('/')
}

const getLineCount = (): number => {
  if (!selectedFile.value) return 0
  const content = isEditing.value ? editContent.value : getFileContent(selectedFile.value)
  return content.split('\n').length
}

const getFileSize = (): number => {
  if (!selectedFile.value) return 0
  const content = isEditing.value ? editContent.value : getFileContent(selectedFile.value)
  return new Blob([content]).size
}

const getLanguage = (path: string): string => {
  const ext = path.split('.').pop()?.toLowerCase()
  const langMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'vue': 'vue',
    'json': 'json',
    'html': 'html',
    'css': 'css',
    'md': 'markdown'
  }
  return langMap[ext || ''] || 'plaintext'
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
    'md': '#083fa1',
    'ico': '#888888'
  }
  return colors[ext || ''] || '#8b949e'
}
</script>

<style scoped>
.file-explorer-demo {
  padding: 2rem;
  min-height: calc(100vh - 80px);
  background: #0d1117;
  color: #c9d1d9;
}

h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
}

.description {
  color: #8b949e;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.explorer-container {
  display: flex;
  border: 1px solid #30363d;
  border-radius: 6px;
  overflow: hidden;
  background: #0d1117;
  height: calc(100vh - 200px);
}

/* Sidebar */
.sidebar {
  width: 300px;
  background: #161b22;
  border-right: 1px solid #30363d;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #30363d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #c9d1d9;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #8b949e;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.toggle-btn:hover {
  background: #30363d;
  color: #c9d1d9;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
  user-select: none;
}

.file-tree::-webkit-scrollbar {
  width: 10px;
}

.file-tree::-webkit-scrollbar-track {
  background: transparent;
}

.file-tree::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 10px;
}

.file-tree::-webkit-scrollbar-thumb:hover {
  background: #484f58;
}

.tree-item {
  cursor: pointer;
}

.item-row {
  display: flex;
  align-items: center;
  padding: 6px 16px 6px 0;
  gap: 6px;
  font-size: 14px;
  color: #c9d1d9;
  transition: background 0.1s ease;
  border-left: 2px solid transparent;
}

.item-row:hover {
  background: rgba(177, 186, 196, 0.12);
}

.item-row.selected {
  background: rgba(56, 139, 253, 0.15);
  border-left-color: #1f6feb;
  font-weight: 600;
}

.chevron {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b949e;
}

.spacer {
  width: 16px;
  flex-shrink: 0;
}

.icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.folder-icon {
  color: #8b949e;
}

.file-icon {
  opacity: 0.9;
}

.name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Content Area */
.content-area {
  flex: 1;
  background: #0d1117;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #8b949e;
}

.empty-icon {
  opacity: 0.4;
}

.empty-state p {
  font-size: 14px;
}

.file-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.file-header {
  padding: 16px;
  border-bottom: 1px solid #30363d;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #161b22;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #8b949e;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.separator {
  color: #484f58;
}

.breadcrumb-item .active {
  color: #c9d1d9;
  font-weight: 600;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  background: transparent;
  border: 1px solid #30363d;
  color: #8b949e;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #30363d;
  border-color: #484f58;
  color: #c9d1d9;
}

.save-btn:hover {
  background: #238636 !important;
  border-color: #238636 !important;
  color: #ffffff !important;
}

.cancel-btn:hover {
  background: #da3633 !important;
  border-color: #da3633 !important;
  color: #ffffff !important;
}

.file-content {
  flex: 1;
  display: flex;
  overflow: auto;
  background: #0d1117;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
}

.line-numbers {
  padding: 16px 0;
  background: #0d1117;
  border-right: 1px solid #30363d;
  user-select: none;
  text-align: right;
  color: #6e7681;
  min-width: 60px;
  padding-right: 16px;
  padding-left: 16px;
}

.line-number {
  height: 19.2px;
  font-size: 12px;
  line-height: 1.6;
}

.code-content {
  flex: 1;
  margin: 0;
  padding: 16px;
  color: #c9d1d9;
  white-space: pre;
  overflow-x: auto;
}

.code-content::-webkit-scrollbar {
  height: 10px;
}

.code-content::-webkit-scrollbar-track {
  background: transparent;
}

.code-content::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 10px;
}

.code-editor {
  flex: 1;
  margin: 0;
  padding: 16px;
  background: #0d1117;
  border: none;
  color: #c9d1d9;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.6;
  resize: none;
  outline: none;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
}

.code-editor::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.code-editor::-webkit-scrollbar-track {
  background: transparent;
}

.code-editor::-webkit-scrollbar-thumb {
  background: #30363d;
  border-radius: 10px;
}

.code-editor::-webkit-scrollbar-thumb:hover {
  background: #484f58;
}

.file-info {
  padding: 12px 16px;
  background: #161b22;
  border-top: 1px solid #30363d;
  display: flex;
  gap: 24px;
  font-size: 12px;
  color: #8b949e;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-item svg {
  opacity: 0.7;
}

.info-item.modified {
  color: #f85149;
  font-weight: 600;
}
</style>
