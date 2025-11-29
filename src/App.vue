<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <nav class="main-nav">
      <div class="nav-brand">Node Editor Comparison</div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/baklava">Custom Demo</RouterLink>
        <RouterLink to="/baklava-raw">Baklava.js Info</RouterLink>
        <RouterLink to="/vue-flow">Vue Flow</RouterLink>
        <RouterLink to="/vue-flow-custom">Vue Flow Custom</RouterLink>
        <RouterLink to="/monaco">Monaco</RouterLink>
      </div>
    </nav>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-nav {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-links a:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-links a.router-link-active {
  background: #42b883;
}

.main-content {
  flex: 1;
  overflow: auto;
}
</style>

