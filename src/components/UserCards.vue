<template>
  <div class="user-cards-container">
    <h2>Список пользователей</h2>
    
    <UserCard 
      :user="adminUser" 
      :is-active="true"
      @user-clicked="handleUserClick"
    >
      <template #actions>
        <button @click="editUser(adminUser)" class="action-button">Редактировать</button>
        <button @click="deleteUser(adminUser.id)" class="action-button delete">Удалить</button>
      </template>
      
      <p>Администратор системы</p>
    </UserCard>
    
    <UserCard 
      v-for="user in users" 
      :key="user.id"
      :user="user"
      :is-active="user.active"
      @user-clicked="handleUserClick"
    >
      <template #actions>
        <button @click="editUser(user)" class="action-button">Редактировать</button>
        <button @click="toggleUserStatus(user.id)" class="action-button">
          {{ user.active ? 'Деактивировать' : 'Активировать' }}
        </button>
      </template>
      
      <p>Обычный пользователь</p>
    </UserCard>

    <div class="stats">
      <h3>Статистика:</h3>
      <p>Всего пользователей: {{ totalUsers }}</p>
      <p>Активных: {{ activeUsers }}</p>
      <p v-if="lastClickedUser">Последний клик: {{ lastClickedUser.name }}</p>
    </div>
  </div>
</template>

<script>
import UserCard from './UserCard.vue'

export default {
  name: 'UserCards',
  
  components: {
    UserCard
  },
  
  data() {
    return {
      adminUser: {
        id: 1,
        name: 'Анна Иванова',
        email: 'anna@example.com',
        role: 'admin'
      },
      users: [
        {
          id: 2,
          name: 'Петр Сидоров',
          email: 'petr@example.com',
          role: 'user',
          active: true
        },
        {
          id: 3,
          name: 'Мария Петрова',
          email: 'maria@example.com',
          role: 'user',
          active: false
        },
        {
          id: 4,
          name: 'Иван Козлов',
          email: 'ivan@example.com',
          role: 'user',
          active: true
        }
      ],
      lastClickedUser: null
    }
  },
  
  computed: {
    totalUsers() {
      return this.users.length + 1
    },
    
    activeUsers() {
      return this.users.filter(u => u.active).length + 1
    }
  },
  
  methods: {
    handleUserClick(user) {
      console.log('Клик по пользователю:', user)
      this.lastClickedUser = user
    },
    
    editUser(user) {
      console.log('Редактирование:', user)
      alert(`Редактирование пользователя: ${user.name}`)
    },
    
    deleteUser(userId) {
      if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        this.users = this.users.filter(u => u.id !== userId)
        console.log('Пользователь удален:', userId)
      }
    },
    
    toggleUserStatus(userId) {
      const user = this.users.find(u => u.id === userId)
      if (user) {
        user.active = !user.active
        console.log(`Пользователь ${user.name} ${user.active ? 'активирован' : 'деактивирован'}`)
      }
    }
  }
}
</script>

<style scoped>
.user-cards-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.user-cards-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.action-button {
  padding: 8px 16px;
  margin: 5px 5px 5px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #0056b3;
}

.action-button.delete {
  background-color: #dc3545;
}

.action-button.delete:hover {
  background-color: #c82333;
}

.stats {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stats h3 {
  margin-bottom: 10px;
  color: #333;
}

.stats p {
  margin: 5px 0;
  color: #666;
}
</style>

