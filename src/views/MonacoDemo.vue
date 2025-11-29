<template>
  <div class="monaco-demo">
    <h1>Monaco Editor Demo</h1>
    <p class="description">The code editor that powers VS Code</p>
    
    <div class="toolbar">
      <select v-model="selectedLanguage" @change="changeLanguage" class="language-select">
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="python">Python</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="json">JSON</option>
      </select>
      
      <select v-model="selectedTheme" @change="changeTheme" class="theme-select">
        <option value="vs">Light</option>
        <option value="vs-dark">Dark</option>
        <option value="hc-black">High Contrast</option>
      </select>
      
      <button @click="runCode" class="run-button">Run Code</button>
    </div>
    
    <div class="editor-container">
      <div ref="editorDiv" class="editor"></div>
    </div>
    
    <div class="output" v-if="output">
      <h3>Output:</h3>
      <pre>{{ output }}</pre>
    </div>
    
    <div class="info">
      <h3>Features:</h3>
      <ul>
        <li>IntelliSense (code completion)</li>
        <li>Syntax highlighting for 100+ languages</li>
        <li>Multiple themes</li>
        <li>Find and replace</li>
        <li>Code folding</li>
        <li>Multi-cursor editing</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

const editorDiv = ref<HTMLElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

const selectedLanguage = ref('javascript')
const selectedTheme = ref('vs-dark')
const output = ref('')

const sampleCode: Record<string, string> = {
  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci sequence:');
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`,
  
  typescript: `// TypeScript Example
interface Person {
  name: string;
  age: number;
}

function greet(person: Person): string {
  return \`Hello, \${person.name}! You are \${person.age} years old.\`;
}

const user: Person = { name: 'Alice', age: 30 };
console.log(greet(user));`,
  
  python: `# Python Example
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(10):
    print(f"Factorial of {i} is {factorial(i)}")`,
  
  html: `<!-- HTML Example -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML page.</p>
</body>
</html>`,
  
  css: `/* CSS Example */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}`,
  
  json: `{
  "name": "monaco-editor-demo",
  "version": "1.0.0",
  "description": "A demo of Monaco Editor features",
  "author": "Your Name",
  "dependencies": {
    "vue": "^3.0.0",
    "monaco-editor": "^0.45.0"
  }
}`
}

onMounted(() => {
  if (editorDiv.value) {
    editor = monaco.editor.create(editorDiv.value, {
      value: sampleCode[selectedLanguage.value],
      language: selectedLanguage.value,
      theme: selectedTheme.value,
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on'
    })
  }
})

onBeforeUnmount(() => {
  editor?.dispose()
})

const changeLanguage = () => {
  if (editor) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, selectedLanguage.value)
      editor.setValue(sampleCode[selectedLanguage.value])
    }
  }
}

const changeTheme = () => {
  monaco.editor.setTheme(selectedTheme.value)
}

const runCode = () => {
  if (editor) {
    const code = editor.getValue()
    
    if (selectedLanguage.value === 'javascript') {
      try {
        // Capture console.log output
        const logs: string[] = []
        const originalLog = console.log
        console.log = (...args) => {
          logs.push(args.map(arg => String(arg)).join(' '))
        }
        
        // Execute the code
        eval(code)
        
        // Restore console.log
        console.log = originalLog
        
        output.value = logs.join('\n') || 'Code executed successfully (no output)'
      } catch (error) {
        output.value = `Error: ${error}`
      }
    } else {
      output.value = `Code execution is only available for JavaScript in this demo.\n\nYour ${selectedLanguage.value} code:\n${code}`
    }
  }
}
</script>

<style scoped>
.monaco-demo {
  padding: 20px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.description {
  margin: 0 0 20px 0;
  color: #666;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.language-select,
.theme-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 14px;
}

.run-button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.run-button:hover {
  background: #35a372;
}

.editor-container {
  flex: 1;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  min-height: 0;
}

.editor {
  width: 100%;
  height: 100%;
}

.output {
  margin-top: 20px;
  padding: 15px;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.output h3 {
  margin-top: 0;
  color: #42b883;
}

.output pre {
  margin: 0;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
}

.info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.info h3 {
  margin-top: 0;
}

.info ul {
  margin: 10px 0;
}
</style>
