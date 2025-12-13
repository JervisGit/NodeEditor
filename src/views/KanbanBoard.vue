<template>
  <div class="kanban-board">
    <div class="board-header">
      <h1>Kanban Board</h1>
      <p class="description">Manage your workflow from development to production</p>
      <button @click="showAddCardModal = true" class="add-card-btn">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M7.75 2a.75.75 0 01.75.75V7h4.25a.75.75 0 010 1.5H8.5v4.25a.75.75 0 01-1.5 0V8.5H2.75a.75.75 0 010-1.5H7V2.75A.75.75 0 017.75 2z"/>
        </svg>
        Add New Card
      </button>
    </div>

    <div class="board-container">
      <!-- Temp Lane -->
      <div class="lane temp-lane">
        <div class="lane-header">
          <div class="lane-title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25V2.75A1.75 1.75 0 0014.25 1H1.75z"/>
            </svg>
            <h2>Temp</h2>
          </div>
          <span class="card-count">{{ tempCards.length }}</span>
        </div>
        <div class="lane-content">
          <div v-if="tempCards.length === 0" class="empty-lane">
            <p>No cards yet</p>
          </div>
          <div
            v-for="card in tempCards"
            :key="card.id"
            class="card"
            :class="{ dragging: draggedCard?.id === card.id }"
            draggable="true"
            @dragstart="handleDragStart(card, 'temp')"
            @dragend="handleDragEnd"
          >
            <div class="card-header">
              <h3>{{ card.name }}</h3>
              <button @click="deleteCard(card.id)" class="delete-btn" title="Delete">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"/>
                </svg>
              </button>
            </div>
            <p class="card-description">{{ card.description }}</p>
            <div class="card-meta">
              <span class="card-date">{{ formatDate(card.createdAt) }}</span>
            </div>
            <button @click="promoteCard(card.id, 'temp')" class="promote-btn">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"/>
              </svg>
              Promote to UAT
            </button>
          </div>
        </div>
      </div>

      <!-- UAT Test Lane -->
      <div class="lane uat-lane">
        <div class="lane-header">
          <div class="lane-title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.5 3.25c0-.966.784-1.75 1.75-1.75h9.5c.966 0 1.75.784 1.75 1.75v8.5a1.75 1.75 0 01-1.75 1.75h-9.5A1.75 1.75 0 011.5 11.75v-8.5z"/>
            </svg>
            <h2>UAT Test</h2>
          </div>
          <span class="card-count">{{ uatCards.length }}</span>
        </div>
        <div class="lane-content">
          <div v-if="uatCards.length === 0" class="empty-lane">
            <p>No cards in testing</p>
          </div>
          <div
            v-for="card in uatCards"
            :key="card.id"
            class="card"
            :class="{ dragging: draggedCard?.id === card.id }"
            draggable="true"
            @dragstart="handleDragStart(card, 'uat')"
            @dragend="handleDragEnd"
          >
            <div class="card-header">
              <h3>{{ card.name }}</h3>
              <button @click="deleteCard(card.id)" class="delete-btn" title="Delete">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"/>
                </svg>
              </button>
            </div>
            <p class="card-description">{{ card.description }}</p>
            <div class="card-meta">
              <span class="card-date">{{ formatDate(card.createdAt) }}</span>
            </div>
            <button @click="promoteCard(card.id, 'uat')" class="promote-btn">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8.22 2.97a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06l2.97-2.97H3.75a.75.75 0 010-1.5h7.44L8.22 4.03a.75.75 0 010-1.06z"/>
              </svg>
              Promote to Production
            </button>
          </div>
        </div>
      </div>

      <!-- Production Lane -->
      <div class="lane production-lane">
        <div class="lane-header">
          <div class="lane-title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 6.97l-4.47 4.47a.75.75 0 01-1.06 0L3.22 8.41a.75.75 0 011.06-1.06L7 10.06l3.97-3.97a.75.75 0 011.06 1.06z"/>
            </svg>
            <h2>Production</h2>
          </div>
          <span class="card-count">{{ productionCards.length }}</span>
        </div>
        <div class="lane-content">
          <div v-if="productionCards.length === 0" class="empty-lane">
            <p>No cards in production</p>
          </div>
          <div
            v-for="card in productionCards"
            :key="card.id"
            class="card production-card"
            :class="{ dragging: draggedCard?.id === card.id }"
            draggable="true"
            @dragstart="handleDragStart(card, 'production')"
            @dragend="handleDragEnd"
          >
            <div class="card-header">
              <h3>{{ card.name }}</h3>
              <button @click="deleteCard(card.id)" class="delete-btn" title="Delete">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11 1.75V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"/>
                </svg>
              </button>
            </div>
            <p class="card-description">{{ card.description }}</p>
            <div class="card-meta">
              <span class="card-date">{{ formatDate(card.createdAt) }}</span>
              <span class="production-badge">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.78 6.97l-4.47 4.47a.75.75 0 01-1.06 0L3.22 8.41a.75.75 0 011.06-1.06L7 10.06l3.97-3.97a.75.75 0 011.06 1.06z"/>
                </svg>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Card Modal -->
    <div v-if="showAddCardModal" class="modal-overlay" @click="showAddCardModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Add New Card</h3>
          <button @click="showAddCardModal = false" class="close-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="cardName">Card Name</label>
            <input
              id="cardName"
              v-model="newCard.name"
              type="text"
              placeholder="Enter card name"
              @keyup.enter="addNewCard"
            />
          </div>
          <div class="form-group">
            <label for="cardDescription">Description</label>
            <textarea
              id="cardDescription"
              v-model="newCard.description"
              placeholder="Enter card description"
              rows="4"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAddCardModal = false" class="cancel-btn">Cancel</button>
          <button @click="addNewCard" class="submit-btn" :disabled="!newCard.name.trim()">
            Add Card
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Card {
  id: number
  name: string
  description: string
  status: 'temp' | 'uat' | 'production'
  createdAt: Date
}

const cards = ref<Card[]>([
  {
    id: 1,
    name: 'User Authentication',
    description: 'Implement JWT-based authentication system',
    status: 'temp',
    createdAt: new Date('2024-11-20')
  },
  {
    id: 2,
    name: 'Dashboard UI',
    description: 'Create responsive dashboard layout',
    status: 'temp',
    createdAt: new Date('2024-11-21')
  },
  {
    id: 3,
    name: 'API Integration',
    description: 'Connect frontend with REST API endpoints',
    status: 'uat',
    createdAt: new Date('2024-11-18')
  },
  {
    id: 4,
    name: 'Payment Gateway',
    description: 'Integrate Stripe payment processing',
    status: 'production',
    createdAt: new Date('2024-11-15')
  }
])

const showAddCardModal = ref(false)
const newCard = ref({
  name: '',
  description: ''
})

const draggedCard = ref<Card | null>(null)
const draggedFrom = ref<string>('')

const tempCards = computed(() => cards.value.filter(card => card.status === 'temp'))
const uatCards = computed(() => cards.value.filter(card => card.status === 'uat'))
const productionCards = computed(() => cards.value.filter(card => card.status === 'production'))

const addNewCard = () => {
  if (!newCard.value.name.trim()) return

  const card: Card = {
    id: Date.now(),
    name: newCard.value.name,
    description: newCard.value.description,
    status: 'temp',
    createdAt: new Date()
  }

  cards.value.push(card)
  
  // Reset form
  newCard.value = { name: '', description: '' }
  showAddCardModal.value = false
}

const promoteCard = (cardId: number, currentStatus: string) => {
  const card = cards.value.find(c => c.id === cardId)
  if (!card) return

  if (currentStatus === 'temp') {
    card.status = 'uat'
  } else if (currentStatus === 'uat') {
    card.status = 'production'
  }
}

const deleteCard = (cardId: number) => {
  if (confirm('Are you sure you want to delete this card?')) {
    const index = cards.value.findIndex(c => c.id === cardId)
    if (index > -1) {
      cards.value.splice(index, 1)
    }
  }
}

const handleDragStart = (card: Card, from: string) => {
  draggedCard.value = card
  draggedFrom.value = from
}

const handleDragEnd = () => {
  draggedCard.value = null
  draggedFrom.value = ''
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString()
}
</script>

<style scoped>
.kanban-board {
  padding: 2rem;
  min-height: calc(100vh - 80px);
  background: #f6f8fa;
}

.board-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-header h1 {
  font-size: 2rem;
  margin: 0;
  color: #24292f;
}

.description {
  color: #57606a;
  margin: 0.25rem 0 0 0;
  font-size: 1rem;
}

.add-card-btn {
  background: #2da44e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s ease;
}

.add-card-btn:hover {
  background: #2c974b;
}

.add-card-btn:active {
  background: #298e46;
  transform: scale(0.98);
}

.board-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  height: calc(100vh - 220px);
}

.lane {
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.lane-header {
  padding: 16px;
  border-bottom: 1px solid #d0d7de;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f6f8fa;
}

.lane-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lane-title h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #24292f;
}

.temp-lane .lane-title svg {
  color: #8250df;
}

.uat-lane .lane-title svg {
  color: #bf8700;
}

.production-lane .lane-title svg {
  color: #1a7f37;
}

.card-count {
  background: #d0d7de;
  color: #24292f;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.lane-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lane-content::-webkit-scrollbar {
  width: 8px;
}

.lane-content::-webkit-scrollbar-track {
  background: transparent;
}

.lane-content::-webkit-scrollbar-thumb {
  background: #d0d7de;
  border-radius: 10px;
}

.lane-content::-webkit-scrollbar-thumb:hover {
  background: #afb8c1;
}

.empty-lane {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #57606a;
  font-size: 14px;
}

.card {
  background: white;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 12px;
  cursor: move;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card:hover {
  border-color: #8250df;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card.dragging {
  opacity: 0.5;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.card-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
  flex: 1;
  line-height: 1.4;
}

.delete-btn {
  background: transparent;
  border: none;
  color: #57606a;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #ffebe9;
  color: #cf222e;
}

.card-description {
  color: #57606a;
  font-size: 13px;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-date {
  color: #8c959f;
  font-size: 12px;
}

.production-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #dafbe1;
  color: #1a7f37;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.promote-btn {
  width: 100%;
  background: #f6f8fa;
  color: #24292f;
  border: 1px solid #d0d7de;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.promote-btn:hover {
  background: #0969da;
  color: white;
  border-color: #0969da;
}

.promote-btn:active {
  background: #0860ca;
  transform: scale(0.98);
}

.production-card .card-header h3 {
  color: #1a7f37;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #d0d7de;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #24292f;
}

.close-btn {
  background: transparent;
  border: none;
  color: #57606a;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f6f8fa;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #24292f;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0969da;
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.1);
}

.form-group textarea {
  resize: vertical;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #d0d7de;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn,
.submit-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: transparent;
  border: 1px solid #d0d7de;
  color: #24292f;
}

.cancel-btn:hover {
  background: #f6f8fa;
}

.submit-btn {
  background: #2da44e;
  color: white;
  border: none;
}

.submit-btn:hover {
  background: #2c974b;
}

.submit-btn:disabled {
  background: #94d3a2;
  cursor: not-allowed;
}

.submit-btn:active:not(:disabled) {
  background: #298e46;
  transform: scale(0.98);
}
</style>
