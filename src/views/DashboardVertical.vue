<template>
  <div class="dashboard-vertical">
    <!-- Top Bar -->
    <header class="top-bar">
      <div class="top-bar-left">
        <h1 class="app-title">Node Editor Test</h1>
      </div>
      <div class="top-bar-right">
        <button class="user-profile-btn" @click="toggleUserMenu">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          </svg>
          <span class="user-name">John Doe</span>
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" class="chevron">
            <path d="M4 6l4 4 4-4H4z"/>
          </svg>
        </button>
        
        <!-- User Menu Dropdown -->
        <div v-if="showUserMenu" class="user-menu">
          <div class="user-menu-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path d="M8 9c-3 0-6 2-6 4v1h12v-1c0-2-3-4-6-4z"/>
            </svg>
            Profile
          </div>
          <div class="user-menu-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
            </svg>
            Settings
          </div>
          <div class="user-menu-divider"></div>
          <div class="user-menu-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
              <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
            </svg>
            Logout
          </div>
        </div>
      </div>
    </header>

    <div class="dashboard-content">
      <!-- Left Sidebar -->
      <aside class="left-sidebar">
        <nav class="nav-menu">
          <RouterLink to="/dashboard" class="nav-item" active-class="active">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
            </svg>
            <span>Home</span>
          </RouterLink>

          <RouterLink to="/baklava" class="nav-item" active-class="active">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z"/>
            </svg>
            <span>Baklava.js</span>
          </RouterLink>

          <RouterLink to="/vue-flow" class="nav-item" active-class="active">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
            </svg>
            <span>Vue Flow</span>
          </RouterLink>

          <RouterLink to="/monaco" class="nav-item" active-class="active">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm-.5 2.5A.5.5 0 0 1 5 6h6a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5zM5 8a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1H5zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1H5z"/>
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1z"/>
            </svg>
            <span>Monaco Editor</span>
          </RouterLink>

          <RouterLink to="/file-explorer" class="nav-item" active-class="active">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5v-9zM2.5 3a.5.5 0 0 0-.5.5V6h12v-.5a.5.5 0 0 0-.5-.5H9c-.964 0-1.71-.629-2.174-1.154C6.374 3.334 5.82 3 5.264 3H2.5zM14 7H2v5.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V7z"/>
            </svg>
            <span>File Explorer</span>
          </RouterLink>

          <RouterLink to="/kanban" class="nav-item" active-class="active">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.5 0A1.5 1.5 0 0 0 1 1.5v13A1.5 1.5 0 0 0 2.5 16h11a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 13.5 0h-11zm0 1h11a.5.5 0 0 1 .5.5V2H2v-.5a.5.5 0 0 1 .5-.5zM2 3h12v12H2V3zm3 2v7h1V5H5zm3 0v7h1V5H8zm3 0v7h1V5h-1z"/>
            </svg>
            <span>Kanban Board</span>
          </RouterLink>

          <div class="nav-divider"></div>

          <RouterLink to="/about" class="nav-item" active-class="active">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            <span>About</span>
          </RouterLink>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const showUserMenu = ref(false)

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Close menu when clicking outside
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-profile-btn') && !target.closest('.user-menu')) {
      showUserMenu.value = false
    }
  })
}
</script>

<style scoped>
.dashboard-vertical {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* Top Bar */
.top-bar {
  height: 60px;
  background: #2c3e50;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.top-bar-left {
  display: flex;
  align-items: center;
}

.app-title {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 700;
}

.top-bar-right {
  position: relative;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
  backdrop-filter: blur(10px);
}

.user-profile-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.user-name {
  font-size: 0.95rem;
}

.chevron {
  opacity: 0.8;
}

.user-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
}

.user-menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  color: #2c3e50;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.95rem;
}

.user-menu-item:hover {
  background: #f5f5f5;
}

.user-menu-item svg {
  opacity: 0.7;
}

.user-menu-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 0.5rem 0;
}

/* Dashboard Content */
.dashboard-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Sidebar */
.left-sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.nav-menu {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  font-weight: 500;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  color: #b39ddb;
  border-left-color: #667eea;
}

.nav-item svg {
  flex-shrink: 0;
}

.nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 1rem 0;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  background: #f8f9fa;
}

.main-content::-webkit-scrollbar {
  width: 10px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Responsive */
@media (max-width: 768px) {
  .left-sidebar {
    width: 200px;
  }

  .top-bar {
    padding: 0 1rem;
  }

  .app-title {
    font-size: 1.2rem;
  }

  .user-name {
    display: none;
  }
}
</style>
