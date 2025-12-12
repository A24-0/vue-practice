import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import UserProfile from '../views/UserProfile.vue'
import UserSettings from '../views/UserSettings.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/profile',
    name: 'Profile',
    component: UserProfile,
    children: [
      {
        path: 'info',
        component: { template: '<div><h3>Информация о профиле</h3><p>Здесь будет информация о пользователе</p></div>' }
      },
      {
        path: 'posts',
        component: { template: '<div><h3>Посты пользователя</h3><p>Здесь будут посты пользователя</p></div>' }
      },
      {
        path: 'friends',
        component: { template: '<div><h3>Друзья</h3><p>Здесь будет список друзей</p></div>' }
      }
    ]
  },
  {
    path: '/profile/:id',
    name: 'UserDetail',
    component: UserProfile,
    props: true
  },
  {
    path: '/settings',
    name: 'Settings',
    component: UserSettings,
    redirect: '/settings/general'
  },
  {
    path: '/settings/:tab',
    name: 'SettingsTab',
    component: UserSettings,
    props: true,
    children: [
      {
        path: 'general',
        component: { template: '<div><h3>Основные настройки</h3><p>Здесь основные настройки профиля</p></div>' }
      },
      {
        path: 'security',
        component: { template: '<div><h3>Безопасность</h3><p>Настройки безопасности и пароля</p></div>' }
      },
      {
        path: 'notifications',
        component: { template: '<div><h3>Уведомления</h3><p>Настройки уведомлений</p></div>' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

