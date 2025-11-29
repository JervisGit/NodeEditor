<template>
  <div class="vue-flow-custom">
    <h1>Vue Flow (Customized)</h1>
    <p class="description">Vue Flow with custom styling to match the Baklava.js look</p>
    
    <div class="demo-container">
      <div class="editor-container">
        <VueFlow 
          v-model:nodes="nodes" 
          v-model:edges="edges"
          :default-viewport="{ zoom: 1 }"
          :min-zoom="0.2"
          :max-zoom="4"
          @node-click="onNodeClick"
          :node-types="nodeTypes"
        >
          <Background pattern-color="#aaa" :gap="16" />
          <Controls />
        </VueFlow>
      </div>
      
      <div class="controls">
        <h3>Add Nodes:</h3>
        <button @click="addNumberNode" class="control-btn">➕ Number Input</button>
        <button @click="addMathNode" class="control-btn">⚙️ Math Operation</button>
        <button @click="addDisplayNode" class="control-btn">📊 Display</button>
        <button @click="clearAll" class="control-btn danger">🗑️ Clear All</button>
      </div>
    </div>
    
    <div class="info">
      <h3>This is Vue Flow with custom nodes!</h3>
      <p>You can fully customize Vue Flow's appearance using custom node components, making it look like any design you want.</p>
      <ul>
        <li>Custom node components</li>
        <li>Custom styling with CSS</li>
        <li>All Vue Flow features preserved</li>
        <li>Production-ready and maintained</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h, markRaw } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import type { Node, Edge } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

// Custom Number Node Component
const NumberNode = {
  props: ['id', 'data'],
  emits: ['update:data'],
  setup(props: any, { emit }: any) {
    const updateValue = (event: Event) => {
      const value = parseFloat((event.target as HTMLInputElement).value)
      emit('update:data', { ...props.data, value })
      calculateAll()
    }
    
    return () => h('div', { class: 'custom-node number-node' }, [
      h('div', { class: 'node-header' }, [
        h('span', { class: 'node-title' }, 'Number')
      ]),
      h('div', { class: 'node-body' }, [
        h('input', {
          type: 'number',
          class: 'number-input',
          value: props.data.value || 10,
          onInput: updateValue
        }),
        h('div', { class: 'ports outputs' }, [
          h('div', { class: 'port-row' }, [
            h('span', { class: 'port-label' }, 'Output')
          ])
        ])
      ])
    ])
  }
}

// Custom Math Node Component
const MathNode = {
  props: ['id', 'data'],
  emits: ['update:data'],
  setup(props: any, { emit }: any) {
    const updateOperation = (event: Event) => {
      const operation = (event.target as HTMLSelectElement).value
      emit('update:data', { ...props.data, operation })
      calculateAll()
    }
    
    return () => h('div', { class: 'custom-node math-node' }, [
      h('div', { class: 'node-header' }, [
        h('span', { class: 'node-title' }, 'Math Operation')
      ]),
      h('div', { class: 'node-body' }, [
        h('div', { class: 'ports inputs' }, [
          h('div', { class: 'port-row' }, [
            h('span', { class: 'port-label' }, 'A')
          ]),
          h('div', { class: 'port-row' }, [
            h('span', { class: 'port-label' }, 'B')
          ])
        ]),
        h('select', {
          class: 'operation-select',
          value: props.data.operation || 'add',
          onChange: updateOperation
        }, [
          h('option', { value: 'add' }, 'Add (+)'),
          h('option', { value: 'subtract' }, 'Subtract (-)'),
          h('option', { value: 'multiply' }, 'Multiply (×)'),
          h('option', { value: 'divide' }, 'Divide (÷)')
        ]),
        h('div', { class: 'ports outputs' }, [
          h('div', { class: 'port-row' }, [
            h('span', { class: 'port-label' }, 'Result')
          ])
        ])
      ])
    ])
  }
}

// Custom Display Node Component
const DisplayNode = {
  props: ['id', 'data'],
  setup(props: any) {
    return () => h('div', { class: 'custom-node display-node' }, [
      h('div', { class: 'node-header' }, [
        h('span', { class: 'node-title' }, 'Display')
      ]),
      h('div', { class: 'node-body' }, [
        h('div', { class: 'ports inputs' }, [
          h('div', { class: 'port-row' }, [
            h('span', { class: 'port-label' }, 'Input')
          ])
        ]),
        h('div', { class: 'display-value' }, [
          h('strong', 'Result: '),
          h('span', props.data.result ?? 'N/A')
        ])
      ])
    ])
  }
}

const nodeTypes = {
  number: markRaw(NumberNode),
  math: markRaw(MathNode),
  display: markRaw(DisplayNode)
}

let nodeId = 0

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'number',
    position: { x: 50, y: 100 },
    data: { value: 10 }
  },
  {
    id: '2',
    type: 'number',
    position: { x: 50, y: 300 },
    data: { value: 5 }
  },
  {
    id: '3',
    type: 'math',
    position: { x: 350, y: 180 },
    data: { operation: 'add', result: 15 }
  },
  {
    id: '4',
    type: 'display',
    position: { x: 700, y: 200 },
    data: { result: 15 }
  }
])

const edges = ref<Edge[]>([
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true }
])

const addNumberNode = () => {
  const id = `node-${nodeId++}`
  nodes.value.push({
    id,
    type: 'number',
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: { value: 10 }
  })
}

const addMathNode = () => {
  const id = `node-${nodeId++}`
  nodes.value.push({
    id,
    type: 'math',
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: { operation: 'add' }
  })
}

const addDisplayNode = () => {
  const id = `node-${nodeId++}`
  nodes.value.push({
    id,
    type: 'display',
    position: { x: Math.random() * 400, y: Math.random() * 400 },
    data: { result: undefined }
  })
}

const clearAll = () => {
  nodes.value = []
  edges.value = []
}

const calculateAll = () => {
  // Simple calculation - in real app you'd do proper topological sorting
  setTimeout(() => {
    const getNodeValue = (nodeId: string): number | undefined => {
      const node = nodes.value.find(n => n.id === nodeId)
      if (!node) return undefined
      
      if (node.type === 'number') {
        return node.data.value
      }
      
      if (node.type === 'math') {
        const inputEdges = edges.value.filter(e => e.target === nodeId)
        const values = inputEdges.map(e => getNodeValue(e.source)).filter(v => v !== undefined)
        
        if (values.length >= 2) {
          const [a, b] = values as number[]
          let result = 0
          
          switch (node.data.operation) {
            case 'add': result = a + b; break
            case 'subtract': result = a - b; break
            case 'multiply': result = a * b; break
            case 'divide': result = b !== 0 ? a / b : 0; break
          }
          
          node.data.result = result
          return result
        }
      }
      
      return undefined
    }
    
    // Update all display nodes
    nodes.value.forEach(node => {
      if (node.type === 'display') {
        const inputEdge = edges.value.find(e => e.target === node.id)
        if (inputEdge) {
          node.data.result = getNodeValue(inputEdge.source)
        }
      }
    })
  }, 0)
}

const onNodeClick = (event: { node: Node }) => {
  console.log('Node clicked:', event.node)
}
</script>

<style scoped>
.vue-flow-custom {
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
  font-size: 1.1rem;
}

.demo-container {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.editor-container {
  flex: 1;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  min-width: 0;
}

.controls {
  width: 200px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.controls h3 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #2c3e50;
}

.control-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #42b883;
  background: white;
  color: #2c3e50;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.control-btn:hover {
  background: #42b883;
  color: white;
}

.control-btn.danger {
  border-color: #ff4444;
  color: #ff4444;
}

.control-btn.danger:hover {
  background: #ff4444;
  color: white;
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
  color: #2c3e50;
}

.info ul {
  margin: 10px 0;
  line-height: 1.8;
}
</style>

<style>
/* Custom node styling - global to override Vue Flow defaults */
.vue-flow-custom .custom-node {
  background: white;
  border: 2px solid #2c3e50;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  font-size: 14px;
}

.vue-flow-custom .node-header {
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  font-weight: 600;
  border-radius: 6px 6px 0 0;
}

.vue-flow-custom .node-body {
  padding: 12px;
}

.vue-flow-custom .ports {
  margin: 8px 0;
}

.vue-flow-custom .port-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.vue-flow-custom .port-label {
  font-size: 13px;
  color: #555;
}

.vue-flow-custom .number-input,
.vue-flow-custom .operation-select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  margin: 8px 0;
}

.vue-flow-custom .display-value {
  padding: 10px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  margin-top: 8px;
}

.vue-flow-custom .vue-flow__node {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}
</style>
