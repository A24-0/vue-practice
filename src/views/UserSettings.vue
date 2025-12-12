<template>
  <div class="user-settings">
    <h1>⚙️ Настройки</h1>
    
    <div class="settings-tabs">
      <router-link to="/settings/general" class="tab">Основные</router-link>
      <router-link to="/settings/security" class="tab">Безопасность</router-link>
      <router-link to="/settings/notifications" class="tab">Уведомления</router-link>
    </div>

    <div class="settings-content">
      <!-- Параметры маршрута передаются как пропсы -->
      <p>Активная вкладка: <strong>{{ currentTab }}</strong></p>
      
      <router-view :current-tab="currentTab"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  
  // Получаем параметр маршрута как пропс
  props: {
    tab: {
      type: String,
      default: 'general'
    }
  },
  
  computed: {
    currentTab() {
      return this.$route.params.tab || 'general'
    }
  }
}
</script>

<style scoped>
.user-settings {
  max-width: 800px;
  margin: 0 auto;
}

.user-settings h1 {
  margin-bottom: 20px;
  color: #333;
}

.settings-tabs {
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
  border: 1px solid #ddd;
  border-radius: 5px;
  transition: all 0.2s;
}

.tab:hover {
  background-color: #f5f5f5;
}

.tab.router-link-active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.settings-content {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.settings-content > p {
  margin-bottom: 15px;
  color: #666;
}
</style>

