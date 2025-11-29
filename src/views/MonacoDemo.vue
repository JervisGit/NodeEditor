<template>
  <div class="monaco-demo">
    <h1 class="demo-title">Monaco Editor IDE</h1>
    <p class="demo-description">A fully-featured code editor powered by Monaco Editor with file management, multiple tabs, and code execution</p>
    
    <div class="ide-container">
      <FileExplorer 
        :items="fileTree"
        :currentFile="currentFile"
        :expandedFolders="expandedFolders"
        @newFile="addNewFile(null)"
        @newFolder="addNewFolder(null)"
        @openFile="handleFileClick"
        @toggleFolder="toggleFolder"
        @deleteItem="deleteItem"
        @contextmenu="handleItemContextMenu"
      />
      
      <div class="main-area">
        <EditorTabs 
          :tabs="openTabs"
          :currentTab="currentFile"
          :theme="selectedTheme"
          @switch="switchToFile"
          @close="closeTab"
          @themeChange="changeTheme"
          @run="runCode"
        />
        
        <div class="editor-wrapper">
          <div ref="editorDiv" class="editor"></div>
        </div>
        
        <OutputPanel 
          :output="output"
          @clear="output = ''"
        />
      </div>
    </div>

    <!-- Context Menu -->
    <div 
      v-if="contextMenu.visible" 
      class="context-menu"
      :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
      @click="contextMenu.visible = false"
    >
      <div class="context-menu-item" @click="addNewFile(contextMenu.target)">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M9.5 1.1l3.4 3.5.1.4v2h-1V6H8V2H3v11h4v1H2.5l-.5-.5v-12l.5-.5h6.7l.3.1z"/>
        </svg>
        New File
      </div>
      <div class="context-menu-item" @click="addNewFolder(contextMenu.target)">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M14.5 2H7.71l-.85-.85L6.51 1h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 2z"/>
        </svg>
        New Folder
      </div>
      <div v-if="contextMenu.target" class="context-menu-divider"></div>
      <div v-if="contextMenu.target" class="context-menu-item danger" @click="deleteItem(contextMenu.target)">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M10 3h3v1h-1v9l-1 1H4l-1-1V4H2V3h3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zM9 2H6v1h3V2zM4 13h7V4H4v9zm2-8H5v7h1V5zm1 0h1v7H7V5zm2 0h1v7H9V5z"/>
        </svg>
        Delete
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import * as monaco from 'monaco-editor'
import FileExplorer from '../components/FileExplorer.vue'
import EditorTabs from '../components/EditorTabs.vue'
import OutputPanel from '../components/OutputPanel.vue'

interface FileItem {
  name: string
  path: string
  type: 'file' | 'folder'
  content?: string
  language?: string
  expanded?: boolean
  depth: number
}

const editorDiv = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

const selectedTheme = ref('vs-dark')
const output = ref('')
const currentFile = ref('src/app.js')
const openTabs = ref<string[]>(['src/app.js'])
const files = ref<Map<string, FileItem>>(new Map())
const expandedFolders = ref<Set<string>>(new Set(['src', 'src/components', 'styles']))

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  target: null as string | null
})

// Initialize file system
const initFileSystem = () => {
  const initialFiles: FileItem[] = [
    { name: 'src', path: 'src', type: 'folder', depth: 0, expanded: true },
    { 
      name: 'app.js', 
      path: 'src/app.js', 
      type: 'file', 
      depth: 1,
      content: `// Welcome to the Monaco IDE!
// Right-click to create folders and files
// Open multiple files with tabs

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
console.log('Create new files and folders using right-click!');
console.log('Edit this code and click Run to execute it.');`,
      language: 'javascript'
    },
    { name: 'components', path: 'src/components', type: 'folder', depth: 1, expanded: true },
    { 
      name: 'Button.js', 
      path: 'src/components/Button.js', 
      type: 'file', 
      depth: 2,
      content: `// Button Component
export default function Button({ label, onClick }) {
  return (
    <button onClick={onClick} className="custom-button">
      {label}
    </button>
  );
}`,
      language: 'javascript'
    },
    { name: 'styles', path: 'styles', type: 'folder', depth: 0, expanded: true },
    { 
      name: 'main.css', 
      path: 'styles/main.css', 
      type: 'file', 
      depth: 1,
      content: `/* Main Stylesheet */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
}

.custom-button {
  padding: 10px 20px;
  background: #0078d4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s ease;
}

.custom-button:hover {
  background: #026ec1;
}`,
      language: 'css'
    },
    { 
      name: 'README.md', 
      path: 'README.md', 
      type: 'file', 
      depth: 0,
      content: `# Monaco Editor IDE

A VS Code-like IDE built with Monaco Editor and Vue 3.

## Features

- 📁 File explorer with folders
- 📝 Multiple file tabs
- 🎨 Syntax highlighting
- ▶️ JavaScript code execution
- 🎯 Context menu support
- 🌈 Multiple themes

## Usage

1. Click on files to open them
2. Right-click to add files/folders
3. Edit code in the editor
4. Click Run to execute JavaScript

Built with Vue 3 + TypeScript + Monaco Editor`,
      language: 'markdown'
    }
  ]

  initialFiles.forEach(file => files.value.set(file.path, file))
}

// Build hierarchical file tree
const fileTree = computed(() => {
  const result: (FileItem & { expanded?: boolean })[] = []
  const sortedFiles = Array.from(files.value.values()).sort((a, b) => {
    if (a.depth !== b.depth) return a.depth - b.depth
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })

  for (const file of sortedFiles) {
    const parentPath = file.path.split('/').slice(0, -1).join('/')
    const isVisible = !parentPath || expandedFolders.value.has(parentPath)
    
    if (isVisible) {
      result.push({
        ...file,
        expanded: file.type === 'folder' && expandedFolders.value.has(file.path)
      })
    }
  }

  return result
})

// File management
const toggleFolder = (path: string) => {
  if (expandedFolders.value.has(path)) {
    expandedFolders.value.delete(path)
  } else {
    expandedFolders.value.add(path)
  }
}

const handleFileClick = (item: FileItem) => {
  if (item.type === 'file') {
    openFile(item.path)
  } else {
    toggleFolder(item.path)
  }
}

const openFile = (path: string) => {
  if (!openTabs.value.includes(path)) {
    openTabs.value.push(path)
  }
  switchToFile(path)
}

const switchToFile = (path: string) => {
  currentFile.value = path
  const file = files.value.get(path)
  if (file && editor) {
    const model = monaco.editor.createModel(file.content || '', file.language || 'plaintext')
    editor.setModel(model)
  }
}

const closeTab = (path: string) => {
  const index = openTabs.value.indexOf(path)
  if (index > -1) {
    openTabs.value.splice(index, 1)
    if (currentFile.value === path && openTabs.value.length > 0) {
      switchToFile(openTabs.value[Math.max(0, index - 1)])
    } else if (openTabs.value.length === 0) {
      currentFile.value = null
      if (editor) {
        editor.setModel(null)
      }
    }
  }
}

const addNewFile = (parentPath: string | null) => {
  const fileName = prompt('Enter file name:')
  if (!fileName) return

  const parent = parentPath ? files.value.get(parentPath) : null
  const depth = parent ? parent.depth + 1 : 0
  const path = parentPath ? `${parentPath}/${fileName}` : fileName

  if (files.value.has(path)) {
    alert('File already exists!')
    return
  }

  const ext = fileName.split('.').pop()?.toLowerCase()
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'json': 'json',
    'html': 'html',
    'css': 'css',
    'md': 'markdown',
    'py': 'python'
  }

  files.value.set(path, {
    name: fileName,
    path,
    type: 'file',
    content: `// New file: ${fileName}\n`,
    language: languageMap[ext || ''] || 'plaintext',
    depth
  })

  if (parentPath) {
    expandedFolders.value.add(parentPath)
  }

  openFile(path)
}

const addNewFolder = (parentPath: string | null) => {
  const folderName = prompt('Enter folder name:')
  if (!folderName) return

  const parent = parentPath ? files.value.get(parentPath) : null
  const depth = parent ? parent.depth + 1 : 0
  const path = parentPath ? `${parentPath}/${folderName}` : folderName

  if (files.value.has(path)) {
    alert('Folder already exists!')
    return
  }

  files.value.set(path, {
    name: folderName,
    path,
    type: 'folder',
    depth
  })

  if (parentPath) {
    expandedFolders.value.add(parentPath)
  }
  expandedFolders.value.add(path)
}

const deleteItem = (path: string) => {
  if (!confirm(`Delete ${path}?`)) return

  // Delete the item and all its children
  const toDelete = Array.from(files.value.keys()).filter(p => p === path || p.startsWith(path + '/'))
  toDelete.forEach(p => {
    files.value.delete(p)
    expandedFolders.value.delete(p)
    closeTab(p)
  })
}

// Context menu
const handleItemContextMenu = (event: MouseEvent, item: FileItem) => {
  event.preventDefault()
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    target: item.path
  }
}

// Theme management
const changeTheme = (theme: string) => {
  selectedTheme.value = theme
  monaco.editor.setTheme(theme)
}

// Code execution
const runCode = () => {
  if (!currentFile.value) {
    output.value = 'No file selected'
    return
  }

  const file = files.value.get(currentFile.value)
  if (!file) return

  if (file.language === 'javascript') {
    try {
      const code = editor?.getValue() || ''
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '))
      }

      eval(code)
      console.log = originalLog
      output.value = logs.join('\n') || 'Code executed successfully (no output)'
    } catch (error) {
      output.value = `Error: ${error}`
    }
  } else {
    output.value = `Code execution is only available for JavaScript files.\n\nCurrent file: ${file.name} (${file.language})`
  }
}

// Monaco Editor initialization
onMounted(() => {
  initFileSystem()

  if (editorDiv.value) {
    editor = monaco.editor.create(editorDiv.value, {
      value: files.value.get(currentFile.value)?.content || '',
      language: files.value.get(currentFile.value)?.language || 'javascript',
      theme: selectedTheme.value,
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 14,
      tabSize: 2,
      scrollBeyondLastLine: false
    })
  }

  // Close context menu on click
  document.addEventListener('click', () => {
    contextMenu.value.visible = false
  })
})

onBeforeUnmount(() => {
  editor?.dispose()
})
</script>

<style scoped>
.monaco-demo {
  padding: 2rem;
  min-height: calc(100vh - 80px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.demo-title {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  color: #ffffff;
}

.demo-description {
  color: #cccccc;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.ide-container {
  flex: 1;
  display: flex;
  border: 1px solid #3e3e42;
  border-radius: 8px;
  overflow: hidden;
  background: #252526;
  min-height: 0;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #1e1e1e;
}

.editor-wrapper {
  flex: 1;
  min-height: 0;
  background: #1e1e1e;
}

.editor {
  width: 100%;
  height: 100%;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: #3c3c3c;
  border: 1px solid #454545;
  border-radius: 5px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  padding: 4px 0;
  min-width: 200px;
  z-index: 1000;
  font-size: 13px;
}

.context-menu-item {
  padding: 6px 16px 6px 12px;
  color: #cccccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background 0.1s ease, color 0.1s ease;
  line-height: 22px;
}

.context-menu-item:hover {
  background: #094771;
  color: #ffffff;
}

.context-menu-item.danger:hover {
  background: #c5302f;
  color: #ffffff;
}

.context-menu-item svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.context-menu-divider {
  height: 1px;
  background: #454545;
  margin: 4px 8px;
}
</style>
