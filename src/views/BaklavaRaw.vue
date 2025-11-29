<template>
  <div class="baklava-raw">
    <h1>Baklava.js (Raw Library Attempt)</h1>
    <p class="description">Attempting to use the actual @baklavajs packages</p>
    
    <div class="warning-box">
      <h3>⚠️ Compatibility Notice</h3>
      <p>The actual Baklava.js library (@baklavajs/renderer-vue) is designed for Vue 2 and has compatibility challenges with Vue 3. Below is information about the library:</p>
    </div>
    
    <div class="info-section">
      <h3>About Baklava.js Library</h3>
      
      <div class="code-block">
        <h4>Installation:</h4>
        <pre><code>npm install @baklavajs/core @baklavajs/renderer-vue</code></pre>
      </div>
      
      <div class="code-block">
        <h4>Basic Usage (Vue 2 / Composition API):</h4>
        <pre><code>import { Editor } from '@baklavajs/core'
import { ViewPlugin } from '@baklavajs/renderer-vue'

const editor = new Editor()
const viewPlugin = new ViewPlugin()
editor.use(viewPlugin)

// Register custom node types
editor.registerNodeType(MyCustomNode)</code></pre>
      </div>
      
      <h3>Key Features:</h3>
      <ul>
        <li><strong>Plugin Architecture:</strong> Extensible through plugins</li>
        <li><strong>Custom Nodes:</strong> Create your own node types with inputs/outputs</li>
        <li><strong>Type Safety:</strong> TypeScript support</li>
        <li><strong>Calculation Engine:</strong> Automatic dependency resolution</li>
        <li><strong>Save/Load:</strong> Serialize and restore graph state</li>
      </ul>
      
      <h3>Vue 3 Challenges:</h3>
      <ul>
        <li>Renderer component uses Vue 2 specific APIs</li>
        <li>Would need custom wrapper or adaptation layer</li>
        <li>Core library works, but rendering layer needs work</li>
        <li>Community working on Vue 3 support</li>
      </ul>
      
      <h3>Your Options:</h3>
      
      <div class="option-card">
        <h4>Option 1: Vue Flow (Recommended)</h4>
        <p>✅ Vue 3 native, actively maintained, feature-rich</p>
        <p>✅ Can be customized to look like any design you want</p>
        <p>✅ See the "Vue Flow Customized" page for an example</p>
      </div>
      
      <div class="option-card">
        <h4>Option 2: Custom Build</h4>
        <p>✅ Full control over appearance and behavior</p>
        <p>✅ Like the custom "Baklava.js Demo" I created for you</p>
        <p>⚠️ You maintain all the code</p>
      </div>
      
      <div class="option-card">
        <h4>Option 3: Adapt Baklava.js Core</h4>
        <p>✅ Use @baklavajs/core for logic</p>
        <p>✅ Build custom Vue 3 renderer</p>
        <p>⚠️ Requires significant development effort</p>
      </div>
      
      <h3>Links:</h3>
      <ul>
        <li><a href="https://baklavajs.github.io/" target="_blank">Baklava.js Official Documentation</a></li>
        <li><a href="https://github.com/newcat/baklavajs" target="_blank">Baklava.js GitHub Repository</a></li>
        <li><a href="https://vueflow.dev/" target="_blank">Vue Flow Documentation (Alternative)</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component explains the Baklava.js situation rather than trying to render it
// since the actual library has Vue 2 dependencies that won't work properly in Vue 3
</script>

<style scoped>
.baklava-raw {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  overflow-y: auto;
  height: calc(100vh - 80px);
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.description {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.warning-box {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.warning-box h3 {
  margin-top: 0;
  color: #856404;
}

.warning-box p {
  color: #856404;
  line-height: 1.6;
}

.info-section {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-section h3 {
  color: #2c3e50;
  margin-top: 30px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #42b883;
}

.info-section h3:first-child {
  margin-top: 0;
}

.info-section ul {
  line-height: 2;
  color: #555;
}

.info-section li {
  margin: 8px 0;
}

.code-block {
  margin: 20px 0;
  background: #1e1e1e;
  padding: 20px;
  border-radius: 8px;
}

.code-block h4 {
  color: #42b883;
  margin-top: 0;
  margin-bottom: 10px;
}

.code-block pre {
  margin: 0;
  overflow-x: auto;
}

.code-block code {
  color: #d4d4d4;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 14px;
  line-height: 1.6;
}

.option-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 15px 0;
  border-left: 4px solid #42b883;
}

.option-card h4 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 10px;
}

.option-card p {
  margin: 8px 0;
  color: #555;
  line-height: 1.6;
}

a {
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
}

a:hover {
  text-decoration: underline;
}
</style>
