<template>
  <div class="monaco-demo">
    <div class="ide-container">
      <!-- Sidebar / File Explorer -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>EXPLORER</h3>
          <button @click="addNewFile" class="icon-btn" title="New File">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9 7h3l-4-4-4 4h3v6h2V7z"/>
            </svg>
          </button>
        </div>
        
        <div class="file-tree">
          <div 
            v-for="file in files" 
            :key="file.name"
            class="file-item"
            :class="{ active: currentFile === file.name }"
            @click="openFile(file.name)"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="file-icon">
              <path d="M9 1H4L1 4v10l3 1h8l3-1V5l-3-4H9zM4 2h5v3h4v8H4V2z"/>
            </svg>
            <span class="file-name">{{ file.name }}</span>
            <button @click.stop="deleteFile(file.name)" class="delete-file-btn" title="Delete">×</button>
          </div>
        </div>
      </div>
      
      <!-- Main Editor Area -->
      <div class="main-area">
        <div class="toolbar">
          <div class="file-tabs">
            <div class="file-tab active">
              <span>{{ currentFile }}</span>
            </div>
          </div>
          
          <div class="toolbar-actions">
            <select v-model="selectedTheme" @change="changeTheme" class="theme-select">
              <option value="vs">Light</option>
              <option value="vs-dark">Dark</option>
              <option value="hc-black">High Contrast</option>
            </select>
            
            <button @click="runCode" class="run-button">▶ Run</button>
          </div>
        </div>
        
        <div class="editor-container">
          <div ref="editorDiv" class="editor"></div>
        </div>
        
        <div class="output-panel" v-if="output">
          <div class="output-header">
            <span>OUTPUT</span>
            <button @click="output = ''" class="clear-btn">Clear</button>
          </div>
          <pre class="output-content">{{ output }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

const editorDiv = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

const selectedTheme = ref('vs-dark')
const output = ref('')
const currentFile = ref('app.js')

interface File {
  name: string
  content: string
  language: string
}

const files = ref<File[]>([
  {
    name: 'app.js',
    content: `// Welcome to the IDE!
// Click on files in the sidebar to switch between them
// Or create new files with the + button

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
console.log('Click "Run" to execute this code');`,
    language: 'javascript'
  },
  {
    name: 'styles.css',
    content: `/* CSS Stylesheet */
body {
  margin: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #1e1e1e;
  color: #d4d4d4;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.button {
  background: #0e639c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.button:hover {
  background: #1177bb;
}`,
    language: 'css'
  },
  {
    name: 'data.json',
    content: `{
  "app": {
    "name": "My IDE",
    "version": "1.0.0",
    "features": [
      "File Explorer",
      "Multiple Files",
      "Syntax Highlighting",
      "Code Execution"
    ]
  },
  "config": {
    "theme": "dark",
    "autoSave": true,
    "fontSize": 14
  }
}`,
    language: 'json'
  }
])

const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const langMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'md': 'markdown',
    'txt': 'plaintext'
  }
  return langMap[ext || ''] || 'plaintext'
}

onMounted(() => {
  if (editorDiv.value) {
    const currentFileData = files.value.find(f => f.name === currentFile.value)
    editor = monaco.editor.create(editorDiv.value, {
      value: currentFileData?.content || '',
      language: currentFileData?.language || 'javascript',
      theme: selectedTheme.value,
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2
    })
    
    // Save content when typing
    editor.onDidChangeModelContent(() => {
      saveCurrentFile()
    })
  }
})

onBeforeUnmount(() => {
  saveCurrentFile()
  editor?.dispose()
})

const saveCurrentFile = () => {
  if (editor) {
    const file = files.value.find(f => f.name === currentFile.value)
    if (file) {
      file.content = editor.getValue()
    }
  }
}

const openFile = (filename: string) => {
  if (filename === currentFile.value) return
  
  saveCurrentFile()
  
  const file = files.value.find(f => f.name === filename)
  if (file && editor) {
    currentFile.value = filename
    editor.setValue(file.content)
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, file.language)
    }
  }
}

const addNewFile = () => {
  const filename = prompt('Enter filename (e.g., script.js, styles.css):')
  if (!filename) return
  
  if (files.value.find(f => f.name === filename)) {
    alert('File already exists!')
    return
  }
  
  const language = getLanguageFromExtension(filename)
  const newFile: File = {
    name: filename,
    content: `// New file: ${filename}\n`,
    language
  }
  
  files.value.push(newFile)
  openFile(filename)
}

const deleteFile = (filename: string) => {
  if (files.value.length === 1) {
    alert('Cannot delete the last file!')
    return
  }
  
  if (!confirm(`Delete ${filename}?`)) return
  
  files.value = files.value.filter(f => f.name !== filename)
  
  if (currentFile.value === filename) {
    openFile(files.value[0].name)
  }
}

const changeTheme = () => {
  monaco.editor.setTheme(selectedTheme.value)
}

const runCode = () => {
  const file = files.value.find(f => f.name === currentFile.value)
  
  if (!file) return
  
  if (file.language === 'javascript') {
    try {
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '))
      }
      
      eval(file.content)
      
      console.log = originalLog
      
      output.value = logs.join('\n') || 'Code executed successfully (no output)'
    } catch (error) {
      output.value = `Error: ${error}`
    }
  } else {
    output.value = `Code execution is only available for JavaScript files.\n\nCurrent file: ${file.name} (${file.language})`
  }
}
</script>

<style scoped>
.monaco-demo {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
}

.ide-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: #252526;
  border-right: 1px solid #3e3e42;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 10px 15px;
  background: #2d2d30;
  border-bottom: 1px solid #3e3e42;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
  color: #cccccc;
  letter-spacing: 0.5px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}

.icon-btn:hover {
  background: #3e3e42;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 5px 0;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 5px 15px;
  cursor: pointer;
  color: #cccccc;
  gap: 8px;
  transition: background 0.2s;
}

.file-item:hover {
  background: #2a2d2e;
}

.file-item.active {
  background: #37373d;
}

.file-icon {
  flex-shrink: 0;
  opacity: 0.8;
}

.file-name {
  flex: 1;
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-file-btn {
  background: transparent;
  border: none;
  color: #858585;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  line-height: 1;
  display: none;
  border-radius: 3px;
}

.file-item:hover .delete-file-btn {
  display: block;
}

.delete-file-btn:hover {
  background: #3e3e42;
  color: #f48771;
}

/* Main Area */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.toolbar {
  background: #2d2d30;
  border-bottom: 1px solid #3e3e42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;
}

.file-tabs {
  display: flex;
  height: 100%;
}

.file-tab {
  padding: 8px 20px;
  background: #1e1e1e;
  color: #ffffff;
  font-size: 13px;
  border-right: 1px solid #3e3e42;
  display: flex;
  align-items: center;
}

.toolbar-actions {
  display: flex;
  gap: 10px;
  padding: 0 10px;
  align-items: center;
}

.theme-select {
  padding: 4px 8px;
  background: #3c3c3c;
  border: 1px solid #3e3e42;
  border-radius: 3px;
  color: #cccccc;
  font-size: 12px;
  cursor: pointer;
}

.theme-select:hover {
  background: #4e4e4e;
}

.run-button {
  padding: 4px 12px;
  background: #0e639c;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.run-button:hover {
  background: #1177bb;
}

.editor-container {
  flex: 1;
  min-height: 0;
  background: #1e1e1e;
}

.editor {
  width: 100%;
  height: 100%;
}

/* Output Panel */
.output-panel {
  height: 200px;
  background: #1e1e1e;
  border-top: 1px solid #3e3e42;
  display: flex;
  flex-direction: column;
}

.output-header {
  padding: 8px 15px;
  background: #2d2d30;
  border-bottom: 1px solid #3e3e42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: #cccccc;
  letter-spacing: 0.5px;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #cccccc;
  cursor: pointer;
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 3px;
}

.clear-btn:hover {
  background: #3e3e42;
}

.output-content {
  flex: 1;
  margin: 0;
  padding: 15px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  color: #d4d4d4;
  overflow-y: auto;
  white-space: pre-wrap;
}

/* Scrollbar styling */
.file-tree::-webkit-scrollbar,
.output-content::-webkit-scrollbar {
  width: 10px;
}

.file-tree::-webkit-scrollbar-track,
.output-content::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.file-tree::-webkit-scrollbar-thumb,
.output-content::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 5px;
}

.file-tree::-webkit-scrollbar-thumb:hover,
.output-content::-webkit-scrollbar-thumb:hover {
  background: #4e4e4e;
}
</style>
