import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Products from '@/views/Products.vue'
import ProductForm from '@/views/ProductForm.vue'
import Categories from '@/views/Categories.vue'
import StockMovements from '@/views/StockMovements.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: Login, meta: { guest: true } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard },
    { path: '/products', name: 'products', component: Products },
    { path: '/products/new', name: 'products-new', component: ProductForm },
    { path: '/products/:id/edit', name: 'products-edit', component: ProductForm },
    { path: '/products/:id/stock', name: 'products-stock', component: StockMovements },
    { path: '/categories', name: 'categories', component: Categories },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.guest && !auth.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
