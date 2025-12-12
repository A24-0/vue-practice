<template>
  <div class="user-profile">
    <h1>👤 Профиль пользователя</h1>
    
    <!-- Показываем ID пользователя из параметров маршрута -->
    <div v-if="$route.params.id" class="user-info">
      <h2>Профиль пользователя #{{ $route.params.id }}</h2>
      <p>Это страница конкретного пользователя</p>
      <div class="user-details">
        <p><strong>ID:</strong> {{ $route.params.id }}</p>
        <p><strong>Имя:</strong> {{ getUserName($route.params.id) }}</p>
      </div>
    </div>
    
    <div v-else class="current-user">
      <h2>Ваш профиль</h2>
      <div class="user-details">
        <p><strong>Email:</strong> user@example.com</p>
        <p><strong>Дата регистрации:</strong> 2024-01-01</p>
        <p><strong>Статус:</strong> Активен</p>
      </div>
    </div>

    <!-- Навигация между разделами профиля -->
    <nav class="profile-tabs">
      <router-link to="/profile/info" class="tab">Информация</router-link>
      <router-link to="/profile/posts" class="tab">Посты</router-link>
      <router-link to="/profile/friends" class="tab">Друзья</router-link>
    </nav>

    <!-- Отображаем вложенные маршруты -->
    <div class="tab-content">
      <router-view></router-view>
    </div>

    <!-- Кнопки навигации -->
    <div class="navigation-buttons">
      <button @click="goBack" class="btn">Назад</button>
      <button @click="goHome" class="btn">На главную</button>
      <button @click="goToSettings" class="btn">Настройки</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'UserProfile',
  
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.back()
    }

    const goHome = () => {
      router.push('/')
    }

    const goToSettings = () => {
      router.push('/settings')
    }

    const getUserName = (id) => {
      const users = {
        1: 'Анна Иванова',
        2: 'Петр Сидоров',
        3: 'Мария Петрова'
      }
      return users[id] || 'Неизвестный пользователь'
    }

    return {
      goBack,
      goHome,
      goToSettings,
      getUserName
    }
  },

  // Хуки навигации
  beforeRouteEnter(to, from, next) {
    console.log('Заходим в профиль пользователя')
    next()
  },

  beforeRouteUpdate(to, from, next) {
    console.log('Обновляем параметры маршрута профиля')
    next()
  }
}
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
}

.user-profile h1 {
  margin-bottom: 20px;
  color: #333;
}

.user-info, .current-user {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-info h2, .current-user h2 {
  margin-bottom: 15px;
  color: #667eea;
}

.user-details {
  margin-top: 15px;
}

.user-details p {
  margin: 8px 0;
  color: #666;
}

.profile-tabs {
  display: flex;
  gap: 10px;
  margin: 20px 0;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.tab {
  padding: 10px 20px;
  text-decoration: none;
  color: #333;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: #667eea;
}

.tab.router-link-active {
  border-bottom-color: #667eea;
  color: #667eea;
  font-weight: bold;
}

.tab-content {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  min-height: 200px;
  background-color: #f8f9fa;
}

.navigation-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #5568d3;
}
</style>

