<template>
  <aside class="app-sidebar" :class="{ 'app-sidebar--collapsed': collapsed }">
    <div class="app-sidebar__content">
      <!-- Logo -->
      <div class="app-sidebar__logo">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6C4 4.89543 4.89543 4 6 4H8C9.10457 4 10 4.89543 10 6V18C10 19.1046 9.10457 20 8 20H6C4.89543 20 4 19.1046 4 18V6Z" fill="currentColor"/>
            <path d="M14 6C14 4.89543 14.8954 4 16 4H18C19.1046 4 20 4.89543 20 6V10C20 11.1046 19.1046 12 18 12H16C14.8954 12 14 11.1046 14 10V6Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      <!-- Navigation Items -->
      <nav class="app-sidebar__nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ 'nav-item--active': activeItem === item.id }"
          @click="handleNavClick(item.id)"
          :title="item.label"
        >
          <component :is="item.icon" class="nav-item__icon" />
          <span v-if="!collapsed" class="nav-item__label">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Bottom Actions -->
      <div class="app-sidebar__bottom">
        <button class="nav-item" :title="'Configuración'">
          <SettingsIcon class="nav-item__icon" />
        </button>
        <button class="nav-item" :title="'Perfil'">
          <UserIcon class="nav-item__icon" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  },
  defaultActive: {
    type: String,
    default: 'home'
  }
});

// Emits
const emit = defineEmits(['navigate', 'toggle-collapse']);

// State
const activeItem = ref(props.defaultActive);

// Navigation items configuration
const navItems = ref([
  {
    id: 'home',
    label: 'Inicio',
    icon: 'HomeIcon'
  },
  {
    id: 'calendar',
    label: 'Calendario',
    icon: 'CalendarIcon'
  },
  {
    id: 'tasks',
    label: 'Tareas',
    icon: 'TasksIcon'
  },
  {
    id: 'clips',
    label: 'Clips',
    icon: 'ClipIcon'
  },
  {
    id: 'money',
    label: 'Finanzas',
    icon: 'MoneyIcon'
  }
]);

// Methods
const handleNavClick = (itemId) => {
  activeItem.value = itemId;
  emit('navigate', itemId);
};
</script>

<script>
// Icon Components (inline SVG components)
const HomeIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  `
};

const CalendarIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  `
};

const TasksIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>
  `
};

const ClipIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  `
};

const MoneyIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  `
};

const SettingsIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6m0 6v6m0-18l-2.5 2.5M12 1l2.5 2.5m-2.5 18.5L9.5 19.5m2.5 2.5l2.5-2.5M1 12h6m6 0h6M1 12l2.5-2.5M1 12l2.5 2.5m18.5-2.5l-2.5-2.5m2.5 2.5l-2.5 2.5"/>
    </svg>
  `
};

const UserIcon = {
  template: `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `
};

export default {
  components: {
    HomeIcon,
    CalendarIcon,
    TasksIcon,
    ClipIcon,
    MoneyIcon,
    SettingsIcon,
    UserIcon
  }
};
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  height: 100vh;
  background: linear-gradient(180deg, #8B6F47 0%, #6B5536 100%);
  color: #FFF8DC;
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.app-sidebar--collapsed {
  width: 64px;
}

.app-sidebar__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
}

.app-sidebar__logo {
  padding: 0 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 248, 220, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFF8DC;
}

.app-sidebar__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: #FFF8DC;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.95rem;
  font-weight: 400;
  white-space: nowrap;
}

.nav-item:hover {
  background: rgba(255, 248, 220, 0.1);
}

.nav-item--active {
  background: rgba(255, 248, 220, 0.15);
  font-weight: 500;
}

.nav-item__icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.nav-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-sidebar--collapsed .nav-item__label {
  display: none;
}

.app-sidebar--collapsed .nav-item {
  justify-content: center;
  padding: 0.75rem;
}

.app-sidebar__bottom {
  padding: 0 0.5rem;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-top: 1px solid rgba(255, 248, 220, 0.1);
  padding-top: 1rem;
}
</style>