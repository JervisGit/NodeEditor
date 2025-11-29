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
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
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
