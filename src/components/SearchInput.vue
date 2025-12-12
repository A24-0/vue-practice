<template>
  <div class="search-container">
    <label v-if="label">{{ label }}</label>
    <div class="input-wrapper">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        class="search-input"
        type="text"
        @keyup.enter="$emit('search')"
      />
      <button 
        v-if="modelValue" 
        @click="$emit('update:modelValue', '')"
        class="clear-btn"
        title="Очистить"
      >
        ×
      </button>
    </div>
    
    <div class="search-actions">
      <button @click="$emit('search')" class="search-btn">Найти</button>
      <button @click="$emit('reset')" class="reset-btn">Сбросить</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Поиск...'
    }
  },
  
  emits: ['update:modelValue', 'search', 'reset']
}
</script>

<style scoped>
.search-container {
  position: relative;
  margin: 20px 0;
}

.search-container label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #333;
}

.search-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.search-btn, .reset-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.search-btn {
  background-color: #667eea;
  color: white;
}

.search-btn:hover {
  background-color: #5568d3;
}

.reset-btn {
  background-color: #6c757d;
  color: white;
}

.reset-btn:hover {
  background-color: #5a6268;
}
</style>

