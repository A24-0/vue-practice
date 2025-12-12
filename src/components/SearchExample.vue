<template>
  <div class="search-example">
    <h2>Поиск пользователей</h2>
    
    <SearchInput 
      v-model="searchQuery"
      label="Поиск по имени:"
      placeholder="Введите имя пользователя..."
      @search="performSearch"
      @reset="resetSearch"
    />
    
    <div class="search-info">
      <p>Текущий запрос: <strong>"{{ searchQuery }}"</strong></p>
      <p v-if="searchQuery">Найдено результатов: {{ searchResults.length }}</p>
    </div>
    
    <div v-if="searchResults.length" class="results-section">
      <h3>Результаты поиска:</h3>
      <ul class="results-list">
        <li v-for="user in searchResults" :key="user.id" class="result-item">
          <div class="user-info">
            <strong>{{ user.name }}</strong> - {{ user.email }}
          </div>
          <div class="user-role">
            Роль: {{ user.role }}
          </div>
        </li>
      </ul>
    </div>
    
    <div v-else-if="searchQuery" class="no-results">
      <p>Ничего не найдено по запросу "{{ searchQuery }}"</p>
    </div>
    
    <div v-else class="all-users">
      <h3>Все пользователи:</h3>
      <ul class="results-list">
        <li v-for="user in users" :key="user.id" class="result-item">
          <div class="user-info">
            <strong>{{ user.name }}</strong> - {{ user.email }}
          </div>
          <div class="user-role">
            Роль: {{ user.role }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SearchInput from './SearchInput.vue'
import { ref, computed } from 'vue'

export default {
  name: 'SearchExample',
  
  components: {
    SearchInput
  },
  
  setup() {
    const searchQuery = ref('')
    const users = ref([
      { id: 1, name: 'Анна', email: 'anna@test.com', role: 'admin' },
      { id: 2, name: 'Борис', email: 'boris@test.com', role: 'user' },
      { id: 3, name: 'Виктор', email: 'victor@test.com', role: 'user' },
      { id: 4, name: 'Галина', email: 'galina@test.com', role: 'user' },
      { id: 5, name: 'Дмитрий', email: 'dmitry@test.com', role: 'moderator' },
      { id: 6, name: 'Елена', email: 'elena@test.com', role: 'user' }
    ])
    
    const searchResults = computed(() => {
      if (!searchQuery.value.trim()) return []
      
      const query = searchQuery.value.toLowerCase().trim()
      return users.value.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      )
    })
    
    const performSearch = () => {
      console.log('Выполняем поиск:', searchQuery.value)
      console.log('Найдено результатов:', searchResults.value.length)
    }
    
    const resetSearch = () => {
      searchQuery.value = ''
      console.log('Поиск сброшен')
    }
    
    return {
      searchQuery,
      searchResults,
      users,
      performSearch,
      resetSearch
    }
  }
}
</script>

<style scoped>
.search-example {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
}

.search-example h2 {
  margin-bottom: 20px;
  color: #333;
}

.search-info {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.search-info p {
  margin: 5px 0;
  color: #666;
}

.results-section, .all-users {
  margin-top: 30px;
}

.results-section h3, .all-users h3 {
  margin-bottom: 15px;
  color: #333;
}

.results-list {
  list-style: none;
  padding: 0;
}

.result-item {
  padding: 15px;
  margin-bottom: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.user-info {
  margin-bottom: 5px;
  color: #333;
}

.user-role {
  font-size: 14px;
  color: #666;
}

.no-results {
  margin-top: 30px;
  padding: 30px;
  text-align: center;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
}
</style>

