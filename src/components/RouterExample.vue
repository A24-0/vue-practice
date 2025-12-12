<template>
  <div class="router-example">
    <h2>Пример 6: Vue Router - Маршрутизация</h2>
    
    <div class="router-info">
      <p>Этот пример демонстрирует работу Vue Router. Используйте навигацию ниже для перехода между страницами.</p>
      <p><strong>Текущий маршрут:</strong> {{ currentRoute.path }}</p>
      <p v-if="currentRoute.params.id"><strong>Параметр ID:</strong> {{ currentRoute.params.id }}</p>
      <p v-if="currentRoute.params.tab"><strong>Параметр Tab:</strong> {{ currentRoute.params.tab }}</p>
    </div>

    <nav class="main-nav">
      <router-link to="/" class="nav-link">Главная</router-link>
      <router-link to="/profile" class="nav-link">Профиль</router-link>
      <router-link to="/profile/1" class="nav-link">Профиль #1</router-link>
      <router-link to="/profile/2" class="nav-link">Профиль #2</router-link>
      <router-link to="/settings" class="nav-link">Настройки</router-link>
    </nav>
    
    <div class="router-content">
      <router-view></router-view>
    </div>

    <div class="router-actions">
      <h3>Программная навигация:</h3>
      <div class="action-buttons">
        <button @click="goToHome" class="action-btn">Перейти на главную</button>
        <button @click="goToProfile" class="action-btn">Перейти в профиль</button>
        <button @click="goToSettings" class="action-btn">Перейти в настройки</button>
        <button @click="goBack" class="action-btn">Назад</button>
        <button @click="goForward" class="action-btn">Вперед</button>
      </div>
    </div>

    <div class="route-info">
      <h3>Информация о маршруте:</h3>
      <pre>{{ routeInfo }}</pre>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'RouterExample',
  
  setup() {
    const route = useRoute()
    const router = useRouter()

    const currentRoute = computed(() => route)
    
    const routeInfo = computed(() => {
      return JSON.stringify({
        path: route.path,
        name: route.name,
        params: route.params,
        query: route.query,
        meta: route.meta
      }, null, 2)
    })

    const goToHome = () => {
      router.push('/')
    }

    const goToProfile = () => {
      router.push('/profile')
    }

    const goToSettings = () => {
      router.push('/settings')
    }

    const goBack = () => {
      router.back()
    }

    const goForward = () => {
      router.forward()
    }

    return {
      currentRoute,
      routeInfo,
      goToHome,
      goToProfile,
      goToSettings,
      goBack,
      goForward
    }
  }
}
</script>

<style scoped>
.router-example {
  max-width: 1000px;
  margin: 0 auto;
}

.router-example h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.router-info {
  padding: 15px;
  background-color: #e7f3ff;
  border-left: 4px solid #667eea;
  border-radius: 4px;
  margin-bottom: 20px;
}

.router-info p {
  margin: 0;
  color: #666;
}

.main-nav {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  gap: 2rem;
  border-radius: 8px;
  margin-bottom: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #34495e;
}

.nav-link.router-link-active {
  background-color: #42b883;
}

.router-content {
  min-height: 400px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.router-actions {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.router-actions h3 {
  margin-bottom: 15px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 10px 20px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #5568d3;
}

.route-info {
  margin-top: 30px;
  padding: 20px;
  background-color: #2d2d2d;
  border-radius: 8px;
}

.route-info h3 {
  margin-bottom: 15px;
  color: #fff;
}

.route-info pre {
  color: #f8f8f2;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
  overflow-x: auto;
}
</style>

