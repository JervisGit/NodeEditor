<template>
  <div class="baklava-demo">
    <h1>Baklava.js Demo</h1>
    <p class="description">A node-based visual programming framework with a plugin architecture</p>
    
    <div class="demo-container">
      <div class="canvas-wrapper">
        <svg 
          ref="svgCanvas" 
          class="node-canvas"
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @wheel="handleWheel"
        >
          <g :transform="`translate(${panX}, ${panY}) scale(${zoom})`">
            <!-- Connections -->
            <g class="connections">
            <path
              v-for="conn in connections"
              :key="`${conn.from.nodeId}-${conn.from.port}-${conn.to.nodeId}-${conn.to.port}`"
              :d="getConnectionPath(conn)"
              class="connection-path"
              stroke="#42b883"
              stroke-width="2"
              fill="none"
            />
          </g>
          
            <!-- Nodes -->
            <g v-for="node in nodes" :key="node.id" :transform="`translate(${node.x}, ${node.y})`">
            <foreignObject :width="node.width" :height="node.height" style="overflow: visible;">
              <div class="node" :class="{ selected: selectedNode === node.id }">
                <div class="node-header" @mousedown="startDrag(node, $event)">
                  <span class="node-title">{{ node.title }}</span>
                  <button class="delete-btn" @click.stop="deleteNode(node.id)">×</button>
                </div>
                <div class="node-body">
                  <!-- Input ports -->
                  <div v-if="node.inputs?.length" class="ports inputs">
                    <div 
                      v-for="input in node.inputs" 
                      :key="input.name" 
                      class="port-row"
                    >
                      <div 
                        class="port input-port"
                        @mousedown="startConnection(node.id, input.name, 'input', $event)"
                      ></div>
                      <span class="port-label">{{ input.name }}</span>
                    </div>
                  </div>
                  
                  <!-- Node content -->
                  <div v-if="node.type === 'number'" class="node-content">
                    <input 
                      type="number" 
                      v-model.number="node.value" 
                      @input="calculate"
                      class="number-input"
                    />
                  </div>
                  
                  <div v-if="node.type === 'operation'" class="node-content">
                    <select v-model="node.operation" @change="calculate" class="operation-select">
                      <option value="add">Add (+)</option>
                      <option value="subtract">Subtract (-)</option>
                      <option value="multiply">Multiply (×)</option>
                      <option value="divide">Divide (÷)</option>
                    </select>
                  </div>
                  
                  <div v-if="node.type === 'display'" class="node-content display">
                    <strong>Result:</strong> {{ node.value ?? 'N/A' }}
                  </div>
                  
                  <!-- Output ports -->
                  <div v-if="node.outputs?.length" class="ports outputs">
                    <div 
                      v-for="output in node.outputs" 
                      :key="output.name" 
                      class="port-row"
                    >
                      <span class="port-label">{{ output.name }}</span>
                      <div 
                        class="port output-port"
                        @mousedown="startConnection(node.id, output.name, 'output', $event)"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </foreignObject>
          </g>
          
          <!-- Temporary connection line while dragging -->
          <path
            v-if="tempConnection"
            :d="tempConnectionPath"
            class="connection-path temp"
            stroke="#42b883"
            stroke-width="2"
              stroke-dasharray="5,5"
              fill="none"
            />
          </g>
        </svg>
        
        <!-- Controls -->
        <div class="canvas-controls">
          <button @click="zoomIn" class="control-btn-canvas" title="Zoom In">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
          <button @click="zoomOut" class="control-btn-canvas" title="Zoom Out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
          </button>
          <button @click="fitView" class="control-btn-canvas" title="Fit View">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          <button 
            @click="togglePanLock" 
            class="control-btn-canvas" 
            :class="{ active: panLocked }"
            :title="panLocked ? 'Nodes Locked (Click to Unlock)' : 'Nodes Unlocked (Click to Lock)'"
          >
            <svg v-if="panLocked" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="5" y="11" width="14" height="10" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
            </svg>
          </button>
        </div>
      </div>      <div class="controls">
        <h3>Add Nodes:</h3>
        <button @click="addNode('number')" class="control-btn">➕ Number Input</button>
        <button @click="addNode('operation')" class="control-btn">⚙️ Math Operation</button>
        <button @click="addNode('display')" class="control-btn">📊 Display</button>
        <button @click="clearAll" class="control-btn danger">🗑️ Clear All</button>
      </div>
    </div>
    
    <div class="info">
      <h3>How to use:</h3>
      <ol>
        <li>Click "Add" buttons to create nodes</li>
        <li>Drag nodes by their header to reposition</li>
        <li>Click and drag from output ports (right) to input ports (left) to create connections</li>
        <li>Change values and operations to see real-time calculation</li>
        <li>Click × to delete individual nodes</li>
      </ol>
      
      <h3>Features:</h3>
      <ul>
        <li>Custom node types with inputs/outputs</li>
        <li>Drag-and-drop node positioning</li>
        <li>Connection-based data flow</li>
        <li>Real-time calculation updates</li>
        <li>Interactive node graph</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Port {
  name: string
}

interface Node {
  id: string
  type: 'number' | 'operation' | 'display'
  title: string
  x: number
  y: number
  width: number
  height: number
  inputs?: Port[]
  outputs?: Port[]
  value?: number
  operation?: string
}

interface Connection {
  from: { nodeId: string; port: string }
  to: { nodeId: string; port: string }
}

const svgCanvas = ref<SVGSVGElement | null>(null)
const nodes = ref<Node[]>([])
const connections = ref<Connection[]>([])
const selectedNode = ref<string | null>(null)
const draggedNode = ref<Node | null>(null)
const dragOffset = ref({ x: 0, y: 0 })
const tempConnection = ref<{ nodeId: string; port: string; type: 'input' | 'output'; x: number; y: number } | null>(null)
const tempMousePos = ref({ x: 0, y: 0 })

// Pan and zoom state
const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })
const panLocked = ref(false)

let nodeCounter = 0

const addNode = (type: 'number' | 'operation' | 'display') => {
  const id = `node-${nodeCounter++}`
  const baseX = 100 + (nodeCounter * 30) % 400
  const baseY = 100 + Math.floor(nodeCounter / 10) * 150
  
  const nodeConfig: Record<string, Partial<Node>> = {
    number: {
      title: 'Number',
      inputs: [],
      outputs: [{ name: 'Output' }],
      value: 10,
      width: 180,
      height: 120
    },
    operation: {
      title: 'Math Operation',
      inputs: [{ name: 'A' }, { name: 'B' }],
      outputs: [{ name: 'Result' }],
      operation: 'add',
      width: 200,
      height: 140
    },
    display: {
      title: 'Display',
      inputs: [{ name: 'Input' }],
      outputs: [],
      value: undefined,
      width: 180,
      height: 100
    }
  }
  
  const config = nodeConfig[type]
  nodes.value.push({
    id,
    type,
    title: config.title!,
    x: baseX,
    y: baseY,
    width: config.width!,
    height: config.height!,
    inputs: config.inputs,
    outputs: config.outputs,
    value: config.value,
    operation: config.operation
  })
}

const deleteNode = (nodeId: string) => {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  connections.value = connections.value.filter(
    c => c.from.nodeId !== nodeId && c.to.nodeId !== nodeId
  )
  calculate()
}

const clearAll = () => {
  nodes.value = []
  connections.value = []
}

const startDrag = (node: Node, event: MouseEvent) => {
  if (panLocked.value) return // Can't drag nodes when locked
  
  event.stopPropagation()
  draggedNode.value = node
  selectedNode.value = node.id
  
  if (svgCanvas.value) {
    const rect = svgCanvas.value.getBoundingClientRect()
    const svgX = (event.clientX - rect.left - panX.value) / zoom.value
    const svgY = (event.clientY - rect.top - panY.value) / zoom.value
    dragOffset.value = {
      x: svgX - node.x,
      y: svgY - node.y
    }
  }
}

const handleCanvasMouseDown = (event: MouseEvent) => {
  if (event.target === svgCanvas.value) {
    selectedNode.value = null
    // Always allow panning when clicking on canvas
    if (event.button === 0) {
      event.preventDefault()
      isPanning.value = true
      panStart.value = {
        x: event.clientX - panX.value,
        y: event.clientY - panY.value
      }
    }
  }
}

const handleCanvasMouseMove = (event: MouseEvent) => {
  if (isPanning.value) {
    panX.value = event.clientX - panStart.value.x
    panY.value = event.clientY - panStart.value.y
    return
  }
  
  if (draggedNode.value && svgCanvas.value) {
    const rect = svgCanvas.value.getBoundingClientRect()
    const svgX = (event.clientX - rect.left - panX.value) / zoom.value
    const svgY = (event.clientY - rect.top - panY.value) / zoom.value
    draggedNode.value.x = svgX - dragOffset.value.x
    draggedNode.value.y = svgY - dragOffset.value.y
  }
  
  if (tempConnection.value && svgCanvas.value) {
    const rect = svgCanvas.value.getBoundingClientRect()
    tempMousePos.value = {
      x: (event.clientX - rect.left - panX.value) / zoom.value,
      y: (event.clientY - rect.top - panY.value) / zoom.value
    }
  }
}

const handleCanvasMouseUp = (event: MouseEvent) => {
  draggedNode.value = null
  isPanning.value = false
  
  if (tempConnection.value) {
    // Check if we're hovering over a port
    const target = event.target as HTMLElement
    if (target.classList.contains('port')) {
      const portRow = target.closest('.port-row')
      const nodeElement = target.closest('[class*="node"]')
      
      if (portRow && nodeElement) {
        const portLabel = portRow.querySelector('.port-label')?.textContent
        const nodeGroup = target.closest('g[transform]')
        const transform = nodeGroup?.getAttribute('transform')
        
        if (portLabel && transform) {
          // Extract node position from transform
          const match = transform.match(/translate\(([\d.]+),\s*([\d.]+)\)/)
          if (match) {
            const targetNode = nodes.value.find(n => 
              Math.abs(n.x - parseFloat(match[1])) < 1 && 
              Math.abs(n.y - parseFloat(match[2])) < 1
            )
            
            if (targetNode) {
              const isTargetInput = target.classList.contains('input-port')
              
              // Create connection (output -> input)
              if (tempConnection.value.type === 'output' && isTargetInput) {
                addConnection(
                  tempConnection.value.nodeId,
                  tempConnection.value.port,
                  targetNode.id,
                  portLabel
                )
              } else if (tempConnection.value.type === 'input' && !isTargetInput) {
                addConnection(
                  targetNode.id,
                  portLabel,
                  tempConnection.value.nodeId,
                  tempConnection.value.port
                )
              }
            }
          }
        }
      }
    }
    
    tempConnection.value = null
  }
}

const startConnection = (nodeId: string, portName: string, type: 'input' | 'output', event: MouseEvent) => {
  event.stopPropagation()
  
  if (svgCanvas.value) {
    const rect = svgCanvas.value.getBoundingClientRect()
    const portElement = event.target as HTMLElement
    const portRect = portElement.getBoundingClientRect()
    
    tempConnection.value = {
      nodeId,
      port: portName,
      type,
      x: (portRect.left + portRect.width / 2 - rect.left - panX.value) / zoom.value,
      y: (portRect.top + portRect.height / 2 - rect.top - panY.value) / zoom.value
    }
    tempMousePos.value = {
      x: tempConnection.value.x,
      y: tempConnection.value.y
    }
  }
}

// Zoom and pan controls
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  
  if (svgCanvas.value) {
    const rect = svgCanvas.value.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    
    // Point in SVG coordinates before zoom
    const svgXBefore = (mouseX - panX.value) / zoom.value
    const svgYBefore = (mouseY - panY.value) / zoom.value
    
    // Apply zoom
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.1, Math.min(3, zoom.value * zoomFactor))
    
    // Point in SVG coordinates after zoom (should stay the same)
    // mouseX = panX + svgX * zoom
    // panX = mouseX - svgX * zoom
    panX.value = mouseX - svgXBefore * newZoom
    panY.value = mouseY - svgYBefore * newZoom
    
    zoom.value = newZoom
  }
}

const zoomIn = () => {
  const newZoom = Math.min(3, zoom.value * 1.2)
  zoom.value = newZoom
}

const zoomOut = () => {
  const newZoom = Math.max(0.1, zoom.value / 1.2)
  zoom.value = newZoom
}

const resetView = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

const togglePanLock = () => {
  panLocked.value = !panLocked.value
}

const fitView = () => {
  if (nodes.value.length === 0) return
  
  // Calculate bounding box of all nodes
  let minX = Infinity, minY = Infinity
  let maxX = -Infinity, maxY = -Infinity
  
  nodes.value.forEach(node => {
    minX = Math.min(minX, node.x)
    minY = Math.min(minY, node.y)
    maxX = Math.max(maxX, node.x + node.width)
    maxY = Math.max(maxY, node.y + node.height)
  })
  
  const contentWidth = maxX - minX
  const contentHeight = maxY - minY
  const contentCenterX = minX + contentWidth / 2
  const contentCenterY = minY + contentHeight / 2
  
  if (svgCanvas.value && svgCanvas.value.parentElement) {
    // Use parent element (canvas-wrapper) for accurate viewport size
    const rect = svgCanvas.value.parentElement.getBoundingClientRect()
    const padding = 50
    
    // Calculate zoom to fit content with padding - use MIN to ensure both dimensions fit
    const availableWidth = rect.width - padding * 2
    const availableHeight = rect.height - padding * 2
    const scaleX = availableWidth / contentWidth
    const scaleY = availableHeight / contentHeight
    const newZoom = Math.min(scaleX, scaleY, 1.5)
    
    zoom.value = newZoom
    
    // Center the content in the viewport with slight downward adjustment
    panX.value = (rect.width / 2) - (contentCenterX * newZoom)
    panY.value = (rect.height / 2) - (contentCenterY * newZoom) - 40
  }
}

const addConnection = (fromNodeId: string, fromPort: string, toNodeId: string, toPort: string) => {
  // Remove existing connection to the same input
  connections.value = connections.value.filter(
    c => !(c.to.nodeId === toNodeId && c.to.port === toPort)
  )
  
  // Add new connection
  connections.value.push({
    from: { nodeId: fromNodeId, port: fromPort },
    to: { nodeId: toNodeId, port: toPort }
  })
  
  calculate()
}

const getPortPosition = (nodeId: string, portName: string, isOutput: boolean) => {
  const node = nodes.value.find(n => n.id === nodeId)
  if (!node) return { x: 0, y: 0 }
  
  const ports = isOutput ? node.outputs : node.inputs
  const portIndex = ports?.findIndex(p => p.name === portName) ?? 0
  
  const portY = 40 + portIndex * 30 + 15
  const portX = isOutput ? node.width - 10 : 10
  
  return {
    x: node.x + portX,
    y: node.y + portY
  }
}

const getConnectionPath = (conn: Connection) => {
  const from = getPortPosition(conn.from.nodeId, conn.from.port, true)
  const to = getPortPosition(conn.to.nodeId, conn.to.port, false)
  
  const dx = to.x - from.x
  const controlPointOffset = Math.abs(dx) * 0.5
  
  return `M ${from.x} ${from.y} C ${from.x + controlPointOffset} ${from.y}, ${to.x - controlPointOffset} ${to.y}, ${to.x} ${to.y}`
}

const tempConnectionPath = computed(() => {
  if (!tempConnection.value) return ''
  
  const start = tempConnection.value.type === 'output' 
    ? getPortPosition(tempConnection.value.nodeId, tempConnection.value.port, true)
    : tempMousePos.value
  
  const end = tempConnection.value.type === 'output'
    ? tempMousePos.value
    : getPortPosition(tempConnection.value.nodeId, tempConnection.value.port, false)
  
  const dx = end.x - start.x
  const controlPointOffset = Math.abs(dx) * 0.5
  
  return `M ${start.x} ${start.y} C ${start.x + controlPointOffset} ${start.y}, ${end.x - controlPointOffset} ${end.y}, ${end.x} ${end.y}`
})

const calculate = () => {
  // Simple calculation system
  const calculated = new Set<string>()
  
  const calculateNode = (nodeId: string): number | undefined => {
    if (calculated.has(nodeId)) {
      return nodes.value.find(n => n.id === nodeId)?.value
    }
    
    const node = nodes.value.find(n => n.id === nodeId)
    if (!node) return undefined
    
    if (node.type === 'number') {
      calculated.add(nodeId)
      return node.value
    }
    
    if (node.type === 'operation') {
      const inputConnections = connections.value.filter(c => c.to.nodeId === nodeId)
      const inputA = inputConnections.find(c => c.to.port === 'A')
      const inputB = inputConnections.find(c => c.to.port === 'B')
      
      const valueA = inputA ? calculateNode(inputA.from.nodeId) : 0
      const valueB = inputB ? calculateNode(inputB.from.nodeId) : 0
      
      if (valueA !== undefined && valueB !== undefined) {
        let result = 0
        switch (node.operation) {
          case 'add': result = valueA + valueB; break
          case 'subtract': result = valueA - valueB; break
          case 'multiply': result = valueA * valueB; break
          case 'divide': result = valueB !== 0 ? valueA / valueB : 0; break
        }
        node.value = result
        calculated.add(nodeId)
        return result
      }
    }
    
    if (node.type === 'display') {
      const inputConnection = connections.value.find(c => c.to.nodeId === nodeId)
      if (inputConnection) {
        const value = calculateNode(inputConnection.from.nodeId)
        node.value = value
        calculated.add(nodeId)
        return value
      }
    }
    
    calculated.add(nodeId)
    return undefined
  }
  
  // Calculate all nodes
  nodes.value.forEach(node => {
    calculateNode(node.id)
  })
}

// Initialize with some example nodes
addNode('number')
addNode('number')
addNode('operation')
addNode('display')

// Position them nicely
if (nodes.value.length >= 4) {
  nodes.value[0].x = 50
  nodes.value[0].y = 80
  nodes.value[0].value = 10
  
  nodes.value[1].x = 50
  nodes.value[1].y = 240
  nodes.value[1].value = 5
  
  nodes.value[2].x = 320
  nodes.value[2].y = 150
  
  nodes.value[3].x = 600
  nodes.value[3].y = 160
  
  // Add example connections
  addConnection(nodes.value[0].id, 'Output', nodes.value[2].id, 'A')
  addConnection(nodes.value[1].id, 'Output', nodes.value[2].id, 'B')
  addConnection(nodes.value[2].id, 'Result', nodes.value[3].id, 'Input')
}
</script>

<style scoped>
.baklava-demo {
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

.canvas-wrapper {
  flex: 1;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  overflow: hidden;
  position: relative;
  min-width: 0;
}

.node-canvas {
  display: block;
  width: 100%;
  height: 100%;
  min-width: 1200px;
  min-height: 900px;
  cursor: default;
}

.node-canvas::-webkit-scrollbar {
  display: none;
}

.node-canvas {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.node {
  background: white;
  border: 2px solid #2c3e50;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: visible;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}

.node.selected {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

.node-header {
  background: #2c3e50;
  color: white;
  padding: 8px 12px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.node-title {
  font-weight: 600;
}

.delete-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  line-height: 1;
}

.delete-btn:hover {
  color: #ff4444;
}

.node-body {
  padding: 12px;
}

.ports {
  margin: 8px 0;
}

.port-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
}

.inputs .port-row {
  justify-content: flex-start;
}

.outputs .port-row {
  justify-content: flex-end;
}

.port {
  width: 14px;
  height: 14px;
  border: 2px solid #2c3e50;
  border-radius: 50%;
  background: white;
  cursor: crosshair;
  transition: all 0.2s;
}

.port:hover {
  background: #42b883;
  border-color: #42b883;
  transform: scale(1.3);
}

.port-label {
  font-size: 13px;
  color: #555;
}

.node-content {
  margin: 10px 0;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

.node-content.display {
  background: #e3f2fd;
  color: #1976d2;
  font-family: 'Courier New', monospace;
}

.number-input {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.operation-select {
  width: 100%;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.connection-path {
  pointer-events: none;
}

.connection-path.temp {
  opacity: 0.6;
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
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #ddd;
  margin-top: 20px;
  max-height: 250px;
  overflow-y: auto;
}

.info h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.info h3:first-child {
  margin-top: 0;
}

.info ol, .info ul {
  line-height: 1.8;
  color: #555;
}

.info li {
  margin: 8px 0;
}

.canvas-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  overflow: hidden;
}

.control-btn-canvas {
  width: 32px;
  height: 32px;
  border: none;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: #374151;
  padding: 0;
}

.control-btn-canvas:hover {
  background: #f3f4f6;
}

.control-btn-canvas:active {
  background: #e5e7eb;
}

.control-btn-canvas.active {
  background: #42b883;
  color: white;
}

.control-btn-canvas.active:hover {
  background: #35a372;
}

.control-btn-canvas + .control-btn-canvas {
  border-top: 1px solid #e5e7eb;
}
</style>
