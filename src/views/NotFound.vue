<template>
  <div class="not-found">
    <h1>404 - Страница не найдена</h1>
    <p>Запрошенная страница не существует.</p>
    <button @click="goHome" class="btn">Вернуться на главную</button>
    
    <div class="debug-info">
      <h3>Отладочная информация:</h3>
      <p><strong>Путь:</strong> {{ $route.path }}</p>
      <p><strong>Параметры:</strong> {{ JSON.stringify($route.params) }}</p>
      <p><strong>Запрос:</strong> {{ JSON.stringify($route.query) }}</p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push('/')
    }

    return {
      goHome
    }
  }
}
</script>

<style scoped>
.not-found {
  text-align: center;
  padding: 50px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.not-found h1 {
  font-size: 3rem;
  color: #dc3545;
  margin-bottom: 20px;
}

.not-found > p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.btn {
  padding: 12px 24px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #5568d3;
}

.debug-info {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: left;
  font-family: monospace;
}

.debug-info h3 {
  margin-bottom: 15px;
  color: #333;
}

.debug-info p {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
}
</style>

