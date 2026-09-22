import { createRouter, createWebHistory } from 'vue-router'

// ----------------------------------------------------------------------------
// ROUTER CONFIGURATION
// ----------------------------------------------------------------------------
// This file maps URL paths → Vue components.
//
// Pattern:
//   path     The URL path shown in the browser address bar.
//            - Static segments:  /students
//            - Params:        /students/:id    (:id will be available
//                               in the component as this.$route.params.id)
//   name     Optional unique identifier for the route (can be used instead of
//            `path` in <RouterLink :to="{name:...}"> or this.$router.push().
//   component The Vue component that gets rendered into <RouterView /> when
//            the URL matches.
// ----------------------------------------------------------------------------

import HomeView from "../views/HomeView.vue"
import StudentsView from "../views/StudentsView.vue"
import StudentForm from "../views/StudentForm.vue"
import StudentsDetailsView from "../views/StudentsDetailsView.vue"

const routes = [
  // Landing / Home page — /
  { path: "/", name: "home", component: HomeView },

  // Students list view — /students
  { path: "/students", name: "students", component: StudentsView },

  // Student DETAIL view — /students/<id>
  // NOTE: Because StudentForm uses `/students/edit/:id` below, the order matters.
  //       `/students/:id` would also match `/students/add` if put first.
  //       More specific routes (with static segments like `edit`) MUST come
  //       before catch-all `:id` routes at the same level.
  { path: "/students/:id", name: "student-details", component: StudentsDetailsView },

  // Edit existing student — reuses StudentForm in edit mode
  // StudentForm checks $route.params.id to decide edit vs. add
  { path: "/students/edit/:id", name: "edit-student", component: StudentForm },

  // Add new student — reuses StudentForm in create mode
  { path: "/students/add", name: "add-student", component: StudentForm },

  // ----------------------------------------------------------------
  // COURSES PAGE (placeholder — link exists in the Navbar)
  // ----------------------------------------------------------------
  // When you're ready to build the courses feature:
  //   1. Create src/views/CoursesView.vue
  //   2. Import it at the top of this file
  //   3. Uncomment the line below
  //   4. Optionally add CourseForm.vue + /courses/add + /courses/edit/:id
  // ----------------------------------------------------------------
  // { path: "/courses", name: "courses", component: CoursesView },
]

const router = createRouter({
  // `createWebHistory` uses the History API for clean URLs (no # in path).
  // Requires the production server (Apache / nginx / etc.) to be configured so
  // that ALL unknown paths fall back to index.html — otherwise refreshes on
  // subroutes return 404.  Vite dev server handles this automatically.
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
