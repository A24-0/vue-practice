<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Редактирование пользователя</h2>
        <button @click="closeModal" class="close-button">&times;</button>
      </div>
      
      <form @submit.prevent="saveUser" class="edit-form">
        <div class="form-group">
          <label for="name">Имя:</label>
          <input 
            id="name"
            type="text" 
            v-model="editedUser.name" 
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email:</label>
          <input 
            id="email"
            type="email" 
            v-model="editedUser.email" 
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="role">Роль:</label>
          <select 
            id="role"
            v-model="editedUser.role" 
            class="form-select"
          >
            <option value="admin">Администратор</option>
            <option value="user">Пользователь</option>
          </select>
        </div>
        
        <div v-if="editedUser.hasOwnProperty('active')" class="form-group">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="editedUser.active"
              class="form-checkbox"
            />
            Активен
          </label>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="closeModal" class="btn btn-cancel">
            Отмена
          </button>
          <button type="submit" class="btn btn-save">
            Сохранить
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserEditModal',
  
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: null
    }
  },
  
  data() {
    return {
      editedUser: {}
    }
  },
  
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          // Создаем копию объекта пользователя для редактирования
          this.editedUser = { ...newUser }
        }
      }
    }
  },
  
  methods: {
    closeModal() {
      this.$emit('close')
    },
    
    saveUser() {
      // Эмитим событие с обновленными данными пользователя
      this.$emit('save', { ...this.editedUser })
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #f0f0f0;
}

.edit-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.form-checkbox {
  margin-right: 8px;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

.btn-save {
  background-color: #667eea;
  color: white;
}

.btn-save:hover {
  background-color: #5568d3;
}
</style>

