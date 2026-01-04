<template>
  <div class="home">
    <div class="hero">
      <h1>Node Editor & IDE Component Comparison</h1>
      <p class="subtitle">Compare Baklava.js, Vue Flow, and Monaco Editor to find the best fit for your application</p>
    </div>

    <div class="cards">
      <div class="card">
        <h2>🎯 Baklava.js</h2>
        <p class="description">A plugin-based node editor with a focus on flexibility and extensibility</p>
        <ul class="features">
          <li>Plugin architecture</li>
          <li>Custom node types</li>
          <li>Type-safe connections</li>
          <li>Event-driven system</li>
        </ul>
        <RouterLink to="/baklava" class="demo-button">Try Baklava.js →</RouterLink>
      </div>

      <div class="card">
        <h2>🌊 Vue Flow</h2>
        <p class="description">A highly customizable Vue 3 flow and diagram builder component</p>
        <ul class="features">
          <li>Reactive and composable</li>
          <li>Built-in controls</li>
          <li>Multiple edge types</li>
          <li>Touch-friendly</li>
        </ul>
        <RouterLink to="/vue-flow" class="demo-button">Try Vue Flow →</RouterLink>
      </div>

      <div class="card">
        <h2>💻 Monaco Editor</h2>
        <p class="description">The powerful code editor that powers Visual Studio Code</p>
        <ul class="features">
          <li>IntelliSense support</li>
          <li>100+ languages</li>
          <li>Multiple themes</li>
          <li>Advanced editing</li>
        </ul>
        <RouterLink to="/monaco" class="demo-button">Try Monaco Editor →</RouterLink>
      </div>
    </div>

    <div class="comparison">
      <h2>Quick Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Baklava.js</th>
            <th>Vue Flow</th>
            <th>Monaco Editor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Use Case</td>
            <td>Logic flows, node graphs</td>
            <td>Workflows, diagrams</td>
            <td>Code editing</td>
          </tr>
          <tr>
            <td>Vue 3 Native</td>
            <td>✅ Yes</td>
            <td>✅ Yes</td>
            <td>⚠️ Wrapper needed</td>
          </tr>
          <tr>
            <td>Customization</td>
            <td>High (plugins)</td>
            <td>High (components)</td>
            <td>Medium</td>
          </tr>
          <tr>
            <td>Learning Curve</td>
            <td>Medium</td>
            <td>Low</td>
            <td>Low-Medium</td>
          </tr>
          <tr>
            <td>Bundle Size</td>
            <td>Small</td>
            <td>Medium</td>
            <td>Large</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="comparison paginated">
      <h2>Detailed Comparison (Paginated)</h2>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Baklava.js</th>
            <th>Vue Flow</th>
            <th>Monaco Editor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedRows" :key="row.feature">
            <td>{{ row.feature }}</td>
            <td>{{ row.baklava }}</td>
            <td>{{ row.vueFlow }}</td>
            <td>{{ row.monaco }}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination-controls">
        <div class="items-per-page">
          <label for="items-per-page">Items per page:</label>
          <select id="items-per-page" v-model="rowsPerPage" @change="resetToFirstPage">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
            <option :value="20">20</option>
            <option :value="comparisonData.length">All</option>
          </select>
        </div>
      </div>
      
      <div class="pagination">
        <button 
          @click="previousPage" 
          :disabled="currentPage === 1"
          class="page-btn"
        >
          ← Previous
        </button>
        
        <div class="page-numbers">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="goToPage(page)"
            :class="['page-number', { active: currentPage === page }]"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          Next →
        </button>
      </div>
      
      <div class="pagination-info">
        Showing {{ startRow }} - {{ endRow }} of {{ comparisonData.length }} features
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, computed } from 'vue'

interface ComparisonRow {
  feature: string
  baklava: string
  vueFlow: string
  monaco: string
}

const currentPage = ref(1)
const rowsPerPage = ref(5)

const comparisonData = ref<ComparisonRow[]>([
  {
    feature: 'Use Case',
    baklava: 'Logic flows, node graphs',
    vueFlow: 'Workflows, diagrams',
    monaco: 'Code editing'
  },
  {
    feature: 'Vue 3 Native',
    baklava: '✅ Yes',
    vueFlow: '✅ Yes',
    monaco: '⚠️ Wrapper needed'
  },
  {
    feature: 'Customization',
    baklava: 'High (plugins)',
    vueFlow: 'High (components)',
    monaco: 'Medium'
  },
  {
    feature: 'Learning Curve',
    baklava: 'Medium',
    vueFlow: 'Low',
    monaco: 'Low-Medium'
  },
  {
    feature: 'Bundle Size',
    baklava: 'Small',
    vueFlow: 'Medium',
    monaco: 'Large'
  },
  {
    feature: 'TypeScript Support',
    baklava: '✅ Full',
    vueFlow: '✅ Full',
    monaco: '✅ Excellent'
  },
  {
    feature: 'Documentation',
    baklava: 'Good',
    vueFlow: 'Excellent',
    monaco: 'Excellent'
  },
  {
    feature: 'Community Size',
    baklava: 'Small',
    vueFlow: 'Medium',
    monaco: 'Large'
  },
  {
    feature: 'License',
    baklava: 'MIT',
    vueFlow: 'MIT',
    monaco: 'MIT'
  },
  {
    feature: 'Performance',
    baklava: 'Good',
    vueFlow: 'Excellent',
    monaco: 'Good'
  },
  {
    feature: 'Mobile Support',
    baklava: '⚠️ Limited',
    vueFlow: '✅ Good',
    monaco: '⚠️ Limited'
  },
  {
    feature: 'Undo/Redo',
    baklava: '✅ Built-in',
    vueFlow: '✅ Built-in',
    monaco: '✅ Built-in'
  }
])

const totalPages = computed(() => Math.ceil(comparisonData.value.length / rowsPerPage.value))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return comparisonData.value.slice(start, end)
})

const startRow = computed(() => (currentPage.value - 1) * rowsPerPage.value + 1)
const endRow = computed(() => Math.min(currentPage.value * rowsPerPage.value, comparisonData.value.length))

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToPage = (page: number) => {
  currentPage.value = page
}

const resetToFirstPage = () => {
  currentPage.value = 1
}
</script>

<style scoped>
.home {
  padding: 2rem;
  min-height: calc(100vh - 80px);
  overflow-y: auto;
}

.hero {
  text-align: center;
  margin-bottom: 4rem;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.hero h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 2rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
}

.features li {
  padding: 0.5rem 0;
  color: #555;
}

.features li:before {
  content: "✓ ";
  color: #42b883;
  font-weight: bold;
  margin-right: 0.5rem;
}

.demo-button {
  display: inline-block;
  background: #42b883;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s;
}

.demo-button:hover {
  background: #35a372;
}

.comparison {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.comparison h2 {
  text-align: center;
  margin-top: 0;
  color: #2c3e50;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1.5rem;
}

thead {
  background: #2c3e50;
  color: white;
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

tbody tr:hover {
  background: #f5f5f5;
}

tbody tr:last-child td {
  border-bottom: none;
}

.pagination-controls {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding: 1rem 0;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #2c3e50;
}

.items-per-page label {
  font-weight: 600;
}

.items-per-page select {
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%232c3e50' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
}

.items-per-page select:hover {
  border-color: #42b883;
}

.items-per-page select:focus {
  outline: none;
  border-color: #42b883;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.page-btn {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #35a372;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  background: transparent;
  color: #2c3e50;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  min-width: 45px;
}

.page-number:hover {
  background: #f0f0f0;
  color: #42b883;
}

.page-number.active {
  background: #42b883;
  color: white;
  border: 2px solid #42b883;
}

.pagination-info {
  text-align: center;
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.comparison.paginated {
  margin-bottom: 4rem;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }
  
  .cards {
    grid-template-columns: 1fr;
  }
  
  table {
    font-size: 0.9rem;
  }
  
  th, td {
    padding: 0.75rem 0.5rem;
  }
}
</style>
