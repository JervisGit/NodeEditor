<template>
  <div class="vue-flow-demo">
    <h1>Vue Flow Demo</h1>
    <p class="description">A highly customizable Vue 3 component for building node-based editors and interactive diagrams</p>
    
    <div class="editor-container">
      <VueFlow 
        v-model:nodes="nodes" 
        v-model:edges="edges"
        :default-viewport="{ zoom: 1 }"
        :min-zoom="0.2"
        :max-zoom="4"
        @node-click="onNodeClick"
      >
        <Background pattern-color="#aaa" :gap="16" />
        <Controls />
      </VueFlow>
    </div>
    
    <div class="info">
      <h3>Features:</h3>
      <ul>
        <li>Highly customizable nodes and edges</li>
        <li>Built-in zoom and pan controls</li>
        <li>Multiple edge types (bezier, step, straight)</li>
        <li>Mini-map support</li>
        <li>Touch-friendly</li>
      </ul>
      <p v-if="selectedNode" class="selected-info">
        Selected: <strong>{{ selectedNode.label }}</strong>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import type { Node, Edge } from '@vue-flow/core'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'

const selectedNode = ref<Node | null>(null)

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'input',
    label: 'Input Node',
    position: { x: 100, y: 100 },
    data: { label: 'Input Node' }
  },
  {
    id: '2',
    label: 'Process Node',
    position: { x: 400, y: 100 },
    data: { label: 'Process Node' }
  },
  {
    id: '3',
    label: 'Decision Node',
    position: { x: 700, y: 100 },
    data: { label: 'Decision Node' },
    style: { background: '#ffeb3b', border: '2px solid #fbc02d' }
  },
  {
    id: '4',
    type: 'output',
    label: 'Output A',
    position: { x: 1000, y: 50 },
    data: { label: 'Output A' }
  },
  {
    id: '5',
    type: 'output',
    label: 'Output B',
    position: { x: 1000, y: 150 },
    data: { label: 'Output B' }
  }
])

const edges = ref<Edge[]>([
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep'
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    label: 'Yes',
    type: 'smoothstep',
    animated: true
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    label: 'No',
    type: 'smoothstep'
  }
])

const onNodeClick = (event: { node: Node }) => {
  selectedNode.value = event.node
  console.log('Node clicked:', event.node)
}
</script>

<style scoped>
.vue-flow-demo {
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

.editor-container {
  flex: 1;
  border: 2px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  min-height: 0;
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

.selected-info {
  margin-top: 10px;
  padding: 10px;
  background: #e3f2fd;
  border-radius: 4px;
}
</style>
