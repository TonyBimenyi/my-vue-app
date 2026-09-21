import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "../views/HomeView.vue"
import StudentsView from "../views/StudentsView.vue"
import StudentsDetailsView from "../views/StudentsDetailsView.vue"

const routes=[
  {path:"/", name: "home", component: HomeView},

  {path:"/students", name:"students", component:StudentsView},

  {path:"/students/:id", name:"student-details", component:StudentsDetailsView}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
