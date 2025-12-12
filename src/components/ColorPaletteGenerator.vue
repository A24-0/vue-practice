<template>
  <div class="palette-generator">
    <h2>🎨 Генератор цветовых палитр</h2>
    
    <div class="controls-section">
      <div class="control-group">
        <label>Количество цветов:</label>
        <select v-model="colorCount" class="select-input">
          <option :value="3">3</option>
          <option :value="5">5</option>
          <option :value="7">7</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Тип палитры:</label>
        <select v-model="paletteType" class="select-input">
          <option value="random">Случайная</option>
          <option value="analogous">Аналогичная</option>
          <option value="monochromatic">Монохромная</option>
          <option value="triad">Триада</option>
          <option value="complementary">Комплементарная</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Настроение:</label>
        <select v-model="mood" class="select-input">
          <option value="any">Любое</option>
          <option value="calm">Спокойное</option>
          <option value="energetic">Энергичное</option>
          <option value="professional">Профессиональное</option>
        </select>
      </div>
      
      <div class="control-group">
        <label>Базовый цвет:</label>
        <input type="color" v-model="baseColor" class="color-input" />
      </div>
      
      <div class="control-group">
        <label>Формат отображения:</label>
        <select v-model="displayFormat" class="select-input">
          <option value="hex">HEX</option>
          <option value="rgb">RGB</option>
        </select>
      </div>
      
      <button @click="generatePalette" class="generate-button">
        🎲 Сгенерировать палитру
      </button>
    </div>

    <div class="palette-container">
      <div 
        v-for="(color, index) in currentPalette" 
        :key="index"
        class="color-card"
        :class="{ pinned: color.pinned }"
        :style="{ backgroundColor: color.hex }"
        @click="copyToClipboard(color)"
      >
        <div class="color-info">
          <div class="color-value">
            {{ displayFormat === 'hex' ? color.hex : color.rgb }}
          </div>
          <div class="color-actions">
            <button 
              @click.stop="togglePin(index)"
              class="pin-button"
              :title="color.pinned ? 'Открепить' : 'Закрепить'"
            >
              {{ color.pinned ? '📌' : '📍' }}
            </button>
          </div>
        </div>
        <div v-if="copyNotification === index" class="copy-notification">
          Скопировано!
        </div>
      </div>
    </div>

    <!-- Превью палитры -->
    <div class="preview-section">
      <h3>Превью палитры</h3>
      
      <div class="preview-controls">
        <label>
          <input type="checkbox" v-model="darkBackground">
          Тёмный фон
        </label>
      </div>

      <div 
        class="preview-mockup"
        :class="{ 'dark-bg': darkBackground }"
      >
        <!-- Mockup кнопки -->
        <div class="mockup-buttons">
          <button 
            v-for="(color, index) in currentPalette.slice(0, 3)" 
            :key="index"
            class="mockup-button"
            :style="{ backgroundColor: color.hex, color: getContrastColor(color.hex) }"
          >
            Кнопка {{ index + 1 }}
          </button>
        </div>

        <!-- Mockup карточка -->
        <div 
          class="mockup-card"
          :style="{ backgroundColor: currentPalette[0]?.hex || '#fff', color: getContrastColor(currentPalette[0]?.hex || '#fff') }"
        >
          <h4>Заголовок карточки</h4>
          <p>Это пример текста на карточке с использованием первого цвета палитры.</p>
        </div>

        <!-- Mockup заголовок -->
        <h3 
          class="mockup-heading"
          :style="{ color: currentPalette[1]?.hex || '#333' }"
        >
          Пример заголовка
        </h3>

        <!-- Дополнительные UI компоненты -->
        <div class="ui-components-preview">
          <div class="ui-card" :style="{ borderColor: currentPalette[2]?.hex || '#ddd' }">
            <div class="ui-card-header" :style="{ backgroundColor: currentPalette[2]?.hex || '#f0f0f0', color: getContrastColor(currentPalette[2]?.hex || '#f0f0f0') }">
              Заголовок карточки
            </div>
            <div class="ui-card-body">
              <p>Содержимое карточки с использованием цветов палитры.</p>
              <div class="ui-badge" :style="{ backgroundColor: currentPalette[3]?.hex || '#667eea', color: getContrastColor(currentPalette[3]?.hex || '#667eea') }">
                Бейдж
              </div>
            </div>
          </div>
          
          <div class="ui-progress">
            <div class="progress-bar" :style="{ backgroundColor: currentPalette[4]?.hex || '#28a745', width: '65%' }"></div>
          </div>
          
          <div class="ui-alert" :style="{ backgroundColor: currentPalette[0]?.hex || '#e7f3ff', borderColor: currentPalette[1]?.hex || '#667eea', color: getContrastColor(currentPalette[0]?.hex || '#e7f3ff') }">
            ⓘ Информационное сообщение
          </div>
        </div>
      </div>
    </div>

    <!-- Цветовой круг -->
    <div class="color-wheel-section" v-if="currentPalette.length > 0">
      <h3>🎨 Цветовой круг</h3>
      <div class="color-wheel-container">
        <canvas ref="colorWheelCanvas" class="color-wheel-canvas" width="300" height="300"></canvas>
        <div class="color-wheel-legend">
          <div v-for="(color, index) in currentPalette" :key="index" class="legend-item">
            <div class="legend-color" :style="{ backgroundColor: color.hex }"></div>
            <span>Цвет {{ index + 1 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Акцентные цвета -->
    <div class="accent-colors-section" v-if="currentPalette.length > 0">
      <h3>✨ Подбор акцентных цветов</h3>
      <button @click="generateAccentColors" class="generate-accent-btn">Сгенерировать акценты</button>
      <div class="accent-colors-grid">
        <div 
          v-for="(accent, index) in accentColors" 
          :key="index"
          class="accent-color-card"
          :style="{ backgroundColor: accent.hex }"
          @click="addAccentToPalette(accent)"
        >
          <div class="accent-info">
            <div class="accent-value">{{ accent.hex }}</div>
            <div class="accent-contrast">
              Контраст: {{ getContrastRatio(accent.hex, currentPalette[0]?.hex || '#fff').toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Анализ доступности -->
    <div class="accessibility-section" v-if="currentPalette.length > 0">
      <h3>🔍 Анализ доступности (WCAG)</h3>
      <div class="contrast-grid">
        <div v-for="(color, index) in currentPalette" :key="index" class="contrast-item">
          <div class="contrast-pair" :style="{ backgroundColor: color.hex, color: getContrastColor(color.hex) }">
            <div class="contrast-text">Текст на фоне</div>
            <div class="contrast-ratio">Контраст: {{ getContrastRatio(color.hex, getContrastColor(color.hex)).toFixed(2) }}</div>
            <div class="wcag-level" :class="getWCAGLevel(color.hex, getContrastColor(color.hex))">
              {{ getWCAGLabel(color.hex, getContrastColor(color.hex)) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Управление библиотекой -->
    <div class="library-section">
      <h3>📚 Библиотека палитр</h3>
      <div class="library-controls">
        <input 
          v-model="paletteName" 
          placeholder="Название палитры" 
          class="text-input"
        />
        <input 
          v-model="paletteTags" 
          placeholder="Теги (через запятую)" 
          class="text-input"
        />
        <button @click="savePaletteToLibrary" class="save-library-btn">💾 Сохранить палитру</button>
      </div>
      
      <div class="search-library">
        <input 
          v-model="searchQuery" 
          placeholder="Поиск по названию или тегам..." 
          class="search-input"
        />
        <select v-model="filterFavorite" class="select-input">
          <option value="all">Все</option>
          <option value="favorite">Только избранные</option>
        </select>
      </div>
      
      <div class="saved-palettes">
        <div 
          v-for="palette in filteredPalettes" 
          :key="palette.id"
          class="saved-palette-item"
          :class="{ favorite: palette.favorite }"
        >
          <div class="palette-preview">
            <div 
              v-for="(color, idx) in palette.colors" 
              :key="idx"
              class="preview-color"
              :style="{ backgroundColor: color.hex }"
            ></div>
          </div>
          <div class="palette-info">
            <h4>{{ palette.name }}</h4>
            <div class="palette-tags">
              <span v-for="tag in palette.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="palette-actions">
            <button @click="loadPalette(palette)" class="action-btn">📂 Загрузить</button>
            <button @click="editPalette(palette)" class="action-btn">✏️ Редактировать</button>
            <button @click="sharePalette(palette)" class="action-btn">🔗 Поделиться</button>
            <button @click="toggleFavorite(palette.id)" class="action-btn">
              {{ palette.favorite ? '⭐' : '☆' }}
            </button>
            <button @click="deletePalette(palette.id)" class="action-btn delete">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <div v-if="editingPalette" class="modal-overlay" @click="editingPalette = null">
      <div class="modal-content" @click.stop>
        <h3>Редактирование палитры</h3>
        <div class="modal-form">
          <label>Название:</label>
          <input v-model="editName" class="text-input" />
          <label>Теги:</label>
          <input v-model="editTags" class="text-input" />
          <div class="modal-actions">
            <button @click="saveEditedPalette" class="save-btn">Сохранить</button>
            <button @click="editingPalette = null" class="cancel-btn">Отмена</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно шаринга -->
    <div v-if="sharingPalette" class="modal-overlay" @click="sharingPalette = null">
      <div class="modal-content" @click.stop>
        <h3>Поделиться палитрой</h3>
        <div class="share-content">
          <p>Ссылка на палитру:</p>
          <div class="share-link">
            <input :value="shareLink" readonly class="share-input" />
            <button @click="copyShareLink" class="copy-btn">📋</button>
          </div>
          <div class="share-qr" v-if="shareQRCode">
            <canvas ref="qrCanvas" width="200" height="200"></canvas>
          </div>
        </div>
        <button @click="sharingPalette = null" class="close-btn">Закрыть</button>
      </div>
    </div>

    <!-- Экспорт -->
    <div class="export-section">
      <h3>📤 Экспорт палитры</h3>
      <div v-if="currentPalette.length === 0" class="export-empty">
        <p>⚠️ Сначала сгенерируйте палитру для экспорта</p>
      </div>
      <div v-else>
        <div class="export-options">
          <button @click="exportFormat = 'css'" :class="{ active: exportFormat === 'css' }" class="export-btn">CSS Variables</button>
          <button @click="exportFormat = 'scss'" :class="{ active: exportFormat === 'scss' }" class="export-btn">SCSS Variables</button>
          <button @click="exportFormat = 'tailwind'" :class="{ active: exportFormat === 'tailwind' }" class="export-btn">Tailwind Config</button>
          <button @click="exportFormat = 'css-code'" :class="{ active: exportFormat === 'css-code' }" class="export-btn">Готовый CSS</button>
        </div>
        <div class="export-output">
          <pre>{{ exportCode }}</pre>
          <div class="export-actions">
            <button @click="copyExportCode" class="copy-export-btn">📋 Копировать код</button>
            <button @click="downloadExportFile" class="download-export-btn">💾 Скачать файл</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Информация о сохранении -->
    <div class="save-info">
      <p v-if="isSaved">✓ Палитра сохранена в localStorage</p>
      <p v-else>Палитра будет автоматически сохранена</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'

export default {
  name: 'ColorPaletteGenerator',
  
  setup() {
    const colorCount = ref(5)
    const displayFormat = ref('hex')
    const currentPalette = ref([])
    const copyNotification = ref(null)
    const darkBackground = ref(false)
    const isSaved = ref(false)
    
    // Продвинутая генерация
    const paletteType = ref('random')
    const mood = ref('any')
    const baseColor = ref('#667eea')
    
    // Библиотека палитр
    const savedPalettes = ref([])
    const paletteName = ref('')
    const paletteTags = ref('')
    const searchQuery = ref('')
    const filterFavorite = ref('all')
    
    // Экспорт
    const exportFormat = ref('css')
    
    // Акцентные цвета
    const accentColors = ref([])
    const colorWheelCanvas = ref(null)
    
    // Редактирование и шаринг
    const editingPalette = ref(null)
    const editName = ref('')
    const editTags = ref('')
    const sharingPalette = ref(null)
    const shareLink = ref('')
    const shareQRCode = ref(null)
    const qrCanvas = ref(null)

    // Генерация случайного цвета в HEX
    const generateRandomColor = () => {
      return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase()
    }

    // Конвертация HEX в RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result 
        ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
        : null
    }

    // Конвертация HEX в HSL
    const hexToHsl = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2
      
      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
          case g: h = ((b - r) / d + 2) / 6; break
          case b: h = ((r - g) / d + 4) / 6; break
        }
      }
      return [h * 360, s * 100, l * 100]
    }

    // Генерация гармоничной палитры с продвинутыми опциями
    const generatePalette = () => {
      console.log('Генерация палитры...', { colorCount: colorCount.value, paletteType: paletteType.value })
      
      let baseHue, saturation, lightness
      
      if (baseColor.value && paletteType.value !== 'random') {
        const [h, s, l] = hexToHsl(baseColor.value)
        baseHue = h
        saturation = s
        lightness = l
      } else {
        baseHue = Math.random() * 360
        saturation = 50 + Math.random() * 50
        lightness = 30 + Math.random() * 40
      }
      
      if (mood.value === 'calm') {
        saturation = Math.min(saturation, 40)
        lightness = 40 + Math.random() * 30
      } else if (mood.value === 'energetic') {
        saturation = 70 + Math.random() * 30
        lightness = 30 + Math.random() * 40
      } else if (mood.value === 'professional') {
        saturation = 20 + Math.random() * 30
        lightness = 30 + Math.random() * 50
      }
      
      const newPalette = []
      const pinnedColors = currentPalette.value.filter(c => c.pinned).map(c => ({ ...c }))
      
      for (let i = 0; i < colorCount.value; i++) {
        const existingPinned = pinnedColors.find(c => c.index === i)
        if (existingPinned) {
          newPalette.push(existingPinned)
          continue
        }

        let hue, colorSaturation, colorLightness
        
        switch (paletteType.value) {
          case 'analogous':
            hue = (baseHue + (i - 1) * 30) % 360
            colorSaturation = saturation + (Math.random() - 0.5) * 20
            colorLightness = lightness + (Math.random() - 0.5) * 20
            break
          case 'monochromatic':
            hue = baseHue
            colorSaturation = saturation + (Math.random() - 0.5) * 20
            colorLightness = lightness + (i - colorCount.value / 2) * 15
            break
          case 'triad':
            hue = (baseHue + i * 120) % 360
            colorSaturation = saturation + (Math.random() - 0.5) * 20
            colorLightness = lightness + (Math.random() - 0.5) * 20
            break
          case 'complementary':
            hue = i % 2 === 0 ? baseHue : (baseHue + 180) % 360
            colorSaturation = saturation + (Math.random() - 0.5) * 20
            colorLightness = lightness + (Math.random() - 0.5) * 20
            break
          default:
            hue = (baseHue + (i * 60 / colorCount.value)) % 360
            colorSaturation = saturation + (Math.random() - 0.5) * 20
            colorLightness = lightness + (Math.random() - 0.5) * 20
        }
        
        const hex = hslToHex(hue, Math.max(0, Math.min(100, colorSaturation)), Math.max(0, Math.min(100, colorLightness)))
        
        newPalette.push({
          hex: hex,
          rgb: hexToRgb(hex),
          pinned: false,
          index: i
        })
      }
      
      console.log('Сгенерировано цветов:', newPalette.length)
      currentPalette.value = newPalette
      saveToLocalStorage()
    }

    // Конвертация HSL в HEX
    const hslToHex = (h, s, l) => {
      l /= 100
      const a = s * Math.min(l, 1 - l) / 100
      const f = n => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
      }
      return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
    }

    // Копирование в буфер обмена
    const copyToClipboard = async (color) => {
      const textToCopy = displayFormat.value === 'hex' ? color.hex : color.rgb
      
      try {
        await navigator.clipboard.writeText(textToCopy)
        copyNotification.value = currentPalette.value.indexOf(color)
        setTimeout(() => {
          copyNotification.value = null
        }, 2000)
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }

    // Закрепление/открепление цвета
    const togglePin = (index) => {
      currentPalette.value[index].pinned = !currentPalette.value[index].pinned
      saveToLocalStorage()
    }

    // Получение контрастного цвета (чёрный или белый)
    const getContrastColor = (hex) => {
      if (!hex) return '#000'
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      return brightness > 128 ? '#000' : '#fff'
    }

    const saveToLocalStorage = () => {
      try {
        localStorage.setItem('colorPalette', JSON.stringify({
          palette: currentPalette.value,
          colorCount: colorCount.value,
          displayFormat: displayFormat.value
        }))
        isSaved.value = true
        setTimeout(() => {
          isSaved.value = false
        }, 3000)
      } catch (err) {
        console.error('Ошибка сохранения:', err)
      }
    }

    const loadFromLocalStorage = () => {
      try {
        const saved = localStorage.getItem('colorPalette')
        if (saved) {
          const data = JSON.parse(saved)
          if (data.palette && data.palette.length > 0) {
            currentPalette.value = data.palette
            colorCount.value = data.colorCount || 5
            displayFormat.value = data.displayFormat || 'hex'
            return true
          }
        }
        return false
      } catch (err) {
        console.error('Ошибка загрузки:', err)
        return false
      }
    }

    // Отслеживание изменений для автосохранения
    watch([colorCount, displayFormat], () => {
      if (currentPalette.value.length > 0) {
        // Обновляем формат отображения для существующих цветов
        currentPalette.value.forEach(color => {
          if (!color.rgb) {
            color.rgb = hexToRgb(color.hex)
          }
        })
        saveToLocalStorage()
      }
    })

    // Генерация новой палитры при изменении количества цветов
    watch(colorCount, (newCount, oldCount) => {
      if (currentPalette.value.length > 0) {
        // Если уменьшаем количество, сохраняем закреплённые цвета
        if (newCount < oldCount) {
          const pinnedColors = currentPalette.value.filter(c => c.pinned && c.index < newCount)
          currentPalette.value = currentPalette.value.slice(0, newCount)
          // Обновляем индексы
          currentPalette.value.forEach((color, index) => {
            color.index = index
          })
          saveToLocalStorage()
        } else {
          generatePalette()
        }
      }
    })

    const getLuminance = (hex) => {
      if (!hex) return 0
      const rgb = hexToRgb(hex)
      if (!rgb) return 0
      const matches = rgb.match(/\d+/g)
      if (!matches || matches.length < 3) return 0
      const [r, g, b] = matches.map(val => {
        val = val / 255
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }

    const getContrastRatio = (color1, color2) => {
      if (!color1 || !color2) return 1
      const lum1 = getLuminance(color1)
      const lum2 = getLuminance(color2)
      if (lum1 === 0 && lum2 === 0) return 1
      const lighter = Math.max(lum1, lum2)
      const darker = Math.min(lum1, lum2)
      if (darker === 0) return 21
      return (lighter + 0.05) / (darker + 0.05)
    }

    const getWCAGLevel = (color1, color2) => {
      const ratio = getContrastRatio(color1, color2)
      if (ratio >= 7) return 'aaa-large'
      if (ratio >= 4.5) return 'aa'
      if (ratio >= 3) return 'aa-large'
      return 'fail'
    }

    const getWCAGLabel = (color1, color2) => {
      const ratio = getContrastRatio(color1, color2)
      if (ratio >= 7) return 'AAA (Large)'
      if (ratio >= 4.5) return 'AA'
      if (ratio >= 3) return 'AA (Large)'
      return 'Недостаточно'
    }

    // Управление библиотекой
    const savePaletteToLibrary = () => {
      if (!paletteName.value.trim()) {
        alert('Введите название палитры')
        return
      }
      
      const palette = {
        id: Date.now(),
        name: paletteName.value.trim(),
        tags: paletteTags.value.split(',').map(t => t.trim()).filter(t => t),
        colors: currentPalette.value.map(c => ({ hex: c.hex, rgb: c.rgb })),
        favorite: false,
        createdAt: new Date().toISOString()
      }
      
      savedPalettes.value.push(palette)
      saveLibraryToStorage()
      paletteName.value = ''
      paletteTags.value = ''
    }

    const loadPalette = (palette) => {
      currentPalette.value = palette.colors.map((c, idx) => ({
        hex: c.hex,
        rgb: c.rgb || hexToRgb(c.hex),
        pinned: false,
        index: idx
      }))
      colorCount.value = palette.colors.length
      saveToLocalStorage()
    }

    const toggleFavorite = (id) => {
      const palette = savedPalettes.value.find(p => p.id === id)
      if (palette) {
        palette.favorite = !palette.favorite
        saveLibraryToStorage()
      }
    }

    const deletePalette = (id) => {
      if (confirm('Удалить эту палитру?')) {
        savedPalettes.value = savedPalettes.value.filter(p => p.id !== id)
        saveLibraryToStorage()
      }
    }

    const saveLibraryToStorage = () => {
      try {
        localStorage.setItem('colorPaletteLibrary', JSON.stringify(savedPalettes.value))
      } catch (err) {
        console.error('Ошибка сохранения библиотеки:', err)
      }
    }

    const loadLibraryFromStorage = () => {
      try {
        const saved = localStorage.getItem('colorPaletteLibrary')
        if (saved) {
          savedPalettes.value = JSON.parse(saved)
        }
      } catch (err) {
        console.error('Ошибка загрузки библиотеки:', err)
      }
    }

    const filteredPalettes = computed(() => {
      let filtered = savedPalettes.value
      
      if (filterFavorite.value === 'favorite') {
        filtered = filtered.filter(p => p.favorite)
      }
      
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      return filtered
    })

    // Экспорт
    const exportCode = computed(() => {
      if (currentPalette.value.length === 0) return ''
      
      switch (exportFormat.value) {
        case 'css':
          return `:root {\n${currentPalette.value.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`
        case 'scss':
          return `$colors: (\n${currentPalette.value.map((c, i) => `  color-${i + 1}: ${c.hex}`).join(',\n')}\n);`
        case 'tailwind':
          return `module.exports = {\n  theme: {\n    extend: {\n      colors: {\n${currentPalette.value.map((c, i) => `        'color-${i + 1}': '${c.hex}'`).join(',\n')}\n      }\n    }\n  }\n}`
        case 'css-code':
          return `.palette {\n${currentPalette.value.map((c, i) => `  --color-${i + 1}: ${c.hex};\n  .color-${i + 1} { color: var(--color-${i + 1}); }`).join('\n')}\n}`
        default:
          return ''
      }
    })

    const copyExportCode = async () => {
      if (currentPalette.value.length === 0) {
        alert('Палитра пустая. Сначала сгенерируйте палитру!')
        return
      }
      
      if (!exportCode.value) {
        alert('Нет данных для экспорта')
        return
      }
      
      try {
        await navigator.clipboard.writeText(exportCode.value)
        alert('✅ Код скопирован в буфер обмена!')
      } catch (err) {
        console.error('Ошибка копирования:', err)
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea')
        textArea.value = exportCode.value
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          alert('✅ Код скопирован в буфер обмена!')
        } catch (fallbackErr) {
          alert('❌ Не удалось скопировать код. Попробуйте выделить и скопировать вручную.')
        }
        document.body.removeChild(textArea)
      }
    }

    const downloadExportFile = () => {
      if (currentPalette.value.length === 0) {
        alert('Палитра пустая. Сначала сгенерируйте палитру!')
        return
      }
      
      if (!exportCode.value) {
        alert('Нет данных для экспорта')
        return
      }
      
      const fileExtensions = {
        'css': 'css',
        'scss': 'scss',
        'tailwind': 'js',
        'css-code': 'css'
      }
      
      const extension = fileExtensions[exportFormat.value] || 'txt'
      const fileName = `palette-export.${extension}`
      
      const blob = new Blob([exportCode.value], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    // Генерация акцентных цветов
    const generateAccentColors = () => {
      if (currentPalette.value.length === 0) return
      
      const baseColor = currentPalette.value[0].hex
      const [h, s, l] = hexToHsl(baseColor)
      
      accentColors.value = []
      for (let i = 0; i < 6; i++) {
        const accentHue = (h + i * 60) % 360
        const accentSaturation = Math.min(100, s + 20)
        const accentLightness = l + (i % 2 === 0 ? 20 : -20)
        
        const hex = hslToHex(accentHue, accentSaturation, Math.max(10, Math.min(90, accentLightness)))
        accentColors.value.push({
          hex: hex,
          rgb: hexToRgb(hex)
        })
      }
    }

    const addAccentToPalette = (accent) => {
      currentPalette.value.push({
        hex: accent.hex,
        rgb: accent.rgb,
        pinned: false,
        index: currentPalette.value.length
      })
      colorCount.value = currentPalette.value.length
      saveToLocalStorage()
    }

    // Отрисовка цветового круга
    const drawColorWheel = () => {
      if (!colorWheelCanvas.value || currentPalette.value.length === 0) return
      
      const canvas = colorWheelCanvas.value
      const ctx = canvas.getContext('2d')
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = 120
      
      // Очищаем canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Рисуем цветовой круг
      for (let angle = 0; angle < 360; angle += 1) {
        const [h, s, l] = [angle, 100, 50]
        const hex = hslToHex(h, s, l)
        ctx.fillStyle = hex
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(centerX, centerY, radius, (angle - 1) * Math.PI / 180, angle * Math.PI / 180)
        ctx.closePath()
        ctx.fill()
      }
      
      // Отмечаем цвета палитры
      currentPalette.value.forEach((color, index) => {
        const [h] = hexToHsl(color.hex)
        const angle = (h - 90) * Math.PI / 180
        const x = centerX + Math.cos(angle) * (radius + 20)
        const y = centerY + Math.sin(angle) * (radius + 20)
        
        ctx.fillStyle = color.hex
        ctx.beginPath()
        ctx.arc(x, y, 12, 0, 2 * Math.PI)
        ctx.fill()
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.stroke()
        
        ctx.fillStyle = '#000'
        ctx.font = 'bold 12px Arial'
        ctx.fillText((index + 1).toString(), x - 4, y + 4)
      })
    }

    // Редактирование палитры
    const editPalette = (palette) => {
      editingPalette.value = palette
      editName.value = palette.name
      editTags.value = palette.tags.join(', ')
    }

    const saveEditedPalette = () => {
      if (!editingPalette.value) return
      
      editingPalette.value.name = editName.value.trim()
      editingPalette.value.tags = editTags.value.split(',').map(t => t.trim()).filter(t => t)
      saveLibraryToStorage()
      editingPalette.value = null
    }

    // Шаринг палитры
    const sharePalette = (palette) => {
      sharingPalette.value = palette
      const paletteData = btoa(JSON.stringify({
        name: palette.name,
        colors: palette.colors
      }))
      shareLink.value = `${window.location.origin}${window.location.pathname}?palette=${paletteData}`
      generateQRCode()
    }

    const copyShareLink = async () => {
      try {
        await navigator.clipboard.writeText(shareLink.value)
        alert('Ссылка скопирована!')
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }

    const generateQRCode = () => {
      // Простая реализация QR кода (в реальном приложении лучше использовать библиотеку)
      if (!qrCanvas.value) return
      const canvas = qrCanvas.value
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#000'
      ctx.font = '10px monospace'
      ctx.fillText('QR Code', 80, 100)
      ctx.fillText('для палитры', 70, 115)
    }

    // Watcher для отрисовки цветового круга
    watch(currentPalette, () => {
      setTimeout(() => drawColorWheel(), 100)
    }, { deep: true })

    onMounted(() => {
      console.log('Компонент смонтирован')
      
      const urlParams = new URLSearchParams(window.location.search)
      const paletteParam = urlParams.get('palette')
      
      if (paletteParam) {
        try {
          const paletteData = JSON.parse(atob(paletteParam))
          loadPalette({
            colors: paletteData.colors.map(c => ({ hex: c.hex, rgb: c.rgb || hexToRgb(c.hex) }))
          })
          console.log('Палитра загружена из URL')
        } catch (err) {
          console.error('Ошибка загрузки палитры из URL:', err)
          if (!loadFromLocalStorage()) {
            console.log('Генерация новой палитры (после ошибки URL)')
            generatePalette()
          }
        }
      } else {
        const loaded = loadFromLocalStorage()
        if (!loaded) {
          console.log('Генерация новой палитры (нет сохранённой)')
          generatePalette()
        } else {
          console.log('Палитра загружена из localStorage:', currentPalette.value.length, 'цветов')
        }
      }
      
      loadLibraryFromStorage()
      
      setTimeout(() => {
        console.log('Проверка палитры после загрузки:', currentPalette.value.length)
        if (currentPalette.value.length > 0) {
          drawColorWheel()
        } else {
          console.log('Палитра пустая, принудительная генерация')
          generatePalette()
        }
      }, 300)
    })

    return {
      colorCount,
      displayFormat,
      currentPalette,
      copyNotification,
      darkBackground,
      isSaved,
      paletteType,
      mood,
      baseColor,
      savedPalettes,
      paletteName,
      paletteTags,
      searchQuery,
      filterFavorite,
      exportFormat,
      exportCode,
      generatePalette,
      copyToClipboard,
      togglePin,
      getContrastColor,
      getContrastRatio,
      getWCAGLevel,
      getWCAGLabel,
      savePaletteToLibrary,
      loadPalette,
      toggleFavorite,
      deletePalette,
      filteredPalettes,
      copyExportCode,
      downloadExportFile,
      accentColors,
      generateAccentColors,
      addAccentToPalette,
      colorWheelCanvas,
      editingPalette,
      editName,
      editTags,
      saveEditedPalette,
      editPalette,
      sharingPalette,
      shareLink,
      sharePalette,
      copyShareLink,
      qrCanvas
    }
  }
}
</script>

<style scoped>
.palette-generator {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}

.palette-generator h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.controls-section {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group label {
  font-weight: bold;
  font-size: 14px;
}

.select-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
}

.generate-button {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.generate-button:hover {
  transform: translateY(-2px);
}

.palette-container {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.color-card {
  flex: 1;
  min-width: 150px;
  height: 200px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 3px solid transparent;
}

.color-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.color-card.pinned {
  border-color: #ffc107;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.3);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.color-value {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.color-actions {
  display: flex;
  gap: 5px;
}

.pin-button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  padding: 5px 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.pin-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.copy-notification {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  animation: fadeInOut 2s;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.preview-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.preview-section h3 {
  margin-bottom: 15px;
}

.preview-controls {
  margin-bottom: 20px;
}

.preview-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.preview-mockup {
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  border: 2px solid #ddd;
  transition: background-color 0.3s;
}

.preview-mockup.dark-bg {
  background-color: #1a1a1a;
  border-color: #444;
}

.mockup-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.mockup-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}

.mockup-button:hover {
  transform: scale(1.05);
}

.mockup-card {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mockup-card h4 {
  margin-bottom: 10px;
  font-size: 20px;
}

.mockup-card p {
  margin: 0;
  line-height: 1.6;
}

.mockup-heading {
  font-size: 28px;
  margin: 0;
}

.save-info {
  margin-top: 20px;
  text-align: center;
  padding: 10px;
  background-color: #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
}

.save-info p {
  margin: 0;
}

.color-input {
  width: 60px;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.accessibility-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.accessibility-section h3 {
  margin-bottom: 15px;
}

.contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.contrast-item {
  border-radius: 8px;
  overflow: hidden;
}

.contrast-pair {
  padding: 20px;
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.contrast-text {
  font-weight: bold;
  font-size: 16px;
}

.contrast-ratio {
  font-size: 14px;
  opacity: 0.9;
}

.wcag-level {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.wcag-level.aaa-large {
  background-color: #28a745;
  color: white;
}

.wcag-level.aa {
  background-color: #17a2b8;
  color: white;
}

.wcag-level.aa-large {
  background-color: #ffc107;
  color: black;
}

.wcag-level.fail {
  background-color: #dc3545;
  color: white;
}

.library-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.library-section h3 {
  margin-bottom: 15px;
}

.library-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.text-input, .search-input {
  flex: 1;
  min-width: 200px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.save-library-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-library-btn:hover {
  background-color: #218838;
}

.search-library {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.saved-palettes {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.saved-palette-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: transform 0.2s;
}

.saved-palette-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.saved-palette-item.favorite {
  border-color: #ffc107;
  background-color: #fffbf0;
}

.palette-preview {
  display: flex;
  gap: 2px;
  width: 100px;
  height: 50px;
  border-radius: 4px;
  overflow: hidden;
}

.preview-color {
  flex: 1;
  height: 100%;
}

.palette-info {
  flex: 1;
}

.palette-info h4 {
  margin-bottom: 5px;
  color: #333;
}

.palette-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.tag {
  padding: 2px 8px;
  background-color: #e9ecef;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.palette-actions {
  display: flex;
  gap: 5px;
}

.action-btn {
  padding: 5px 10px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.action-btn:hover {
  background-color: #5568d3;
}

.action-btn.delete {
  background-color: #dc3545;
}

.action-btn.delete:hover {
  background-color: #c82333;
}

.export-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.export-section h3 {
  margin-bottom: 15px;
}

.export-options {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.export-btn {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background-color: #5a6268;
}

.export-btn.active {
  background-color: #667eea;
}

.export-empty {
  padding: 20px;
  text-align: center;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 4px;
  color: #856404;
}

.export-empty p {
  margin: 0;
  font-weight: bold;
}

.export-output {
  position: relative;
}

.export-output pre {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
  min-height: 100px;
}

.export-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.copy-export-btn,
.download-export-btn {
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.copy-export-btn:hover,
.download-export-btn:hover {
  background-color: #218838;
}

.download-export-btn {
  background-color: #667eea;
}

.download-export-btn:hover {
  background-color: #5568d3;
}

.color-wheel-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.color-wheel-section h3 {
  margin-bottom: 15px;
}

.color-wheel-container {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.color-wheel-canvas {
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.color-wheel-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 2px solid #ddd;
}

.accent-colors-section {
  margin-top: 40px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.accent-colors-section h3 {
  margin-bottom: 15px;
}

.generate-accent-btn {
  padding: 10px 20px;
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 20px;
}

.generate-accent-btn:hover {
  background-color: #138496;
}

.accent-colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.accent-color-card {
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.accent-color-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.accent-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: white;
}

.accent-value {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 3px;
}

.accent-contrast {
  font-size: 10px;
  opacity: 0.9;
}

.ui-components-preview {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.ui-card {
  border: 2px solid;
  border-radius: 8px;
  overflow: hidden;
}

.ui-card-header {
  padding: 12px 16px;
  font-weight: bold;
}

.ui-card-body {
  padding: 16px;
  background-color: rgba(255,255,255,0.9);
}

.ui-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  margin-top: 10px;
}

.ui-progress {
  width: 100%;
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s;
  border-radius: 10px;
}

.ui-alert {
  padding: 12px 16px;
  border-radius: 6px;
  border-left: 4px solid;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-bottom: 20px;
  color: #333;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-form label {
  font-weight: bold;
  color: #333;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.save-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.save-btn:hover {
  background-color: #218838;
}

.cancel-btn, .close-btn {
  padding: 10px 20px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-btn:hover, .close-btn:hover {
  background-color: #5a6268;
}

.share-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.share-link {
  display: flex;
  gap: 10px;
}

.share-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.copy-btn {
  padding: 8px 16px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.copy-btn:hover {
  background-color: #5568d3;
}

.share-qr {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>

