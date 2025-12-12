<template>
  <div class="user-card" :class="user.role">
    <h3>{{ user.name }}</h3>
    <p>Email: {{ user.email }}</p>
    <p>Роль: {{ user.role }}</p>
    <p>Статус: {{ isActive ? 'Активен' : 'Неактивен' }}</p>
    
    <slot name="actions"></slot>
    
    <slot>
      <p>Нет дополнительной информации</p>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  
  props: {
    user: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.name && value.email
      }
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      localClicks: 0
    }
  },
  
  methods: {
    handleClick() {
      this.localClicks++
      this.$emit('user-clicked', this.user)
    }
  }
}
</script>

<style scoped>
.user-card {
  border: 1px solid #ddd;
  padding: 16px;
  margin: 10px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.user-card.admin {
  border-color: #ff6b6b;
  background-color: #fff5f5;
}

.user-card.user {
  border-color: #4ecdc4;
  background-color: #f0fff4;
}

.user-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.user-card p {
  margin: 5px 0;
  color: #666;
}
</style>

