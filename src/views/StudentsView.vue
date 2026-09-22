<template>
  <!-- ================================================================
       STUDENTS LIST VIEW
       ================================================================ -->
  <div class="students-page">

    <!-- Page header -->
    <h1>Students List</h1>

    <!-- Inline error message banner (only shown if error is set) -->
    <div v-if="error" class="error-banner">
      {{ error }}
    </div>

    <!-- Loading indicator (only shown while the network call is in flight) -->
    <p v-if="loading" class="loading">Loading students…</p>

    <!-- Empty state — no data + not loading + no error = empty table -->
    <p v-else-if="students.length === 0" class="empty">
      No students yet.
      <button class="add-btn-inline" @click="goToAddStudent">Add one</button>
    </p>

    <!--
      Student cards grid.
      v-for loops over `students` (populated by `getStudents()` on mount).
      :key is required by Vue for efficient list diffing — always use a
      unique field like `student.id`, never the array index.
    -->
    <div v-else class="cards">
      <div class="card" v-for="student in students" :key="student.id">

        <!-- Card header: student name -->
        <div class="card_header">
          <!--
            Clicking the name navigates to the detail page.
            We use RouterLink instead of a plain <a> so Vue handles SPA
            navigation without a full page reload.
          -->
          <RouterLink :to="`/students/${student.id}`">
            <h2>{{ student.name }}</h2>
          </RouterLink>
        </div>

        <!-- Card body: quick info -->
        <div class="card_body">
          <!--
            Course display — tries multiple strategies, in order:
              1. `student.course_name`    → direct string from backend (e.g. DRF SerializerMethodField)
              2. `student.course?.name`   → nested course object with a name field
              3. `courseNameById.get(id)` → lookup via the separate /api/courses/ list
              4. `student.course`         → raw int ID as final fallback
          -->
          <p>
            Course:
            {{
              student.course_name
                ?? (typeof student.course === "object" ? student.course?.name : null)
                ?? courseNameById.get(Number(student.course))
                ?? student.course
            }}
          </p>
          <p>Age: {{ student.age }}</p>
        </div>

        <!-- Action buttons -->
        <div class="action_btn">
          <!-- Modify → opens the form in edit mode (see StudentForm.vue) -->
          <button
            class="btn btn-modify"
            @click="editStudent(student.id)"
          >
            Modify
          </button>

          <!-- Delete → calls DELETE /students/<id>/ on the API -->
          <button
            class="btn btn-delete"
            @click="deleteStudent(student.id)"
          >
            Delete
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
// Import the shared axios instance.  All API calls in this component
// go through it (so they get the same baseURL, headers, timeout, etc.).
import api from "../services/api"

export default {
  name: "StudentsView",

  // ----------------------------------------------------------------
  // REACTIVE DATA
  // ----------------------------------------------------------------
  // Everything returned by `data()` is made reactive by Vue — changing
  // any of these values causes the <template> to re-render automatically.
  data() {
    return {
      students: [],   // Array of student objects from the API
      loading: false, // true while an API call is pending (disables UI)
      error: "",      // Error message string, shown in the banner above

      // List of courses fetched from /api/courses/.  Used as a
      // lookup table so we can display "JavaScript" instead of a
      // bare course ID (e.g. 2) in each student card.
      courses: [],
    }
  },

  // ----------------------------------------------------------------
  // COMPUTED: courseNameById(id) — course ID → human name
  // ----------------------------------------------------------------
  // A Map is built once from `courses` so the per-card lookup is O(1)
  // instead of O(n) with find() on every render.
  computed: {
    courseNameById() {
      const m = new Map()
      for (const c of this.courses) {
        const label = c.name ?? c.title ?? String(c.id)
        m.set(Number(c.id), label)
      }
      return m
    },
  },

  // ----------------------------------------------------------------
  // LIFECYCLE HOOK
  // ----------------------------------------------------------------
  // `mounted()` runs once, immediately after this component is rendered
  // into the DOM.  Perfect time to fetch initial data.
  // We fetch BOTH courses and students — courses are needed to translate
  // a student's `course: 2` integer into "JavaScript" for display.
  mounted() {
    this.getCourses()
    this.getStudents()
  },

  // ----------------------------------------------------------------
  // METHODS
  // ----------------------------------------------------------------
  methods: {

    /**
     * Fetch the list of courses from the backend.
     * Endpoint: GET /api/courses/
     * Populates the `courses` array used by `courseNameById` so that
     * student cards can show the course NAME instead of the raw FK ID.
     */
    getCourses() {
      api.get("/courses/")
        .then((response) => {
          const data = response.data
          this.courses = Array.isArray(data) ? data : data.results
        })
        .catch((error) => {
          console.warn(
            "Could not load course list. "
              + "Course names will fall back to raw IDs.",
            error.message
          )
        })
    },

    /**
     * Fetch the full list of students from the backend.
     * Endpoint: GET /api/students/
     * Handles three response shapes (useful when swapping backends):
     *   - plain array:           [{id, name, ...}, ...]
     *   - paginated DRF-style:   { count, results: [ ... ] }
     */
    getStudents() {
      this.loading = true
      this.error = ""

      // api.get() prepends baseURL ("/api") from services/api.js, so
      // this actually requests:  GET http://localhost:5173/api/students/
      // which Vite then proxies to the real backend.
      api.get("/students/")
        .then((response) => {
          const data = response.data
          // Support both raw arrays and paginated wrappers
          this.students = Array.isArray(data) ? data : data.results
        })
        .catch((error) => {
          // --- Rich debugging info in the browser console ---
          console.error("Error loading students:", error.message)
          if (error.response) {
            // Backend replied with a non-2xx status (404, 500…)
            console.error("Response data:", error.response.data)
            console.error("Status:", error.response.status)
          } else if (error.request) {
            // Request was sent but no response received at all
            // (network error, CORS block, proxy 502…)
            console.error("No response received. Request:", error.request)
          } else {
            // Something blew up BEFORE the request was even made
            console.error("Error config:", error.config)
          }
          // Show a user-friendly message in the page
          this.error = `Failed to load students: ${error.message}`
        })
        .finally(() => {
          // Runs whether the promise resolved or rejected — so we
          // never get stuck with a permanent "Loading…" spinner.
          this.loading = false
        })
    },

    /** Navigate to the "Add new student" form. */
    goToAddStudent() {
      this.$router.push("/students/add")
    },

    /**
     * Navigate to the edit form for a specific student.
     * The route `/students/edit/:id` reuses the same StudentForm.vue
     * component — it checks for `this.$route.params.id` to decide
     * whether it's in "add" or "edit" mode.
     */
    editStudent(id) {
      this.$router.push(`/students/edit/${id}`)
    },

    /**
     * Delete a student from the backend + remove them from the list.
     * Endpoint: DELETE /api/students/<id>/
     *
     * NOTE: after a successful DELETE we don't re-fetch the whole list
     * — instead we filter out the deleted student locally.  This is a
     * minor UX win (one less network call).  Uncomment the
     * `this.getStudents()` line if you prefer to always re-sync.
     */
    deleteStudent(id) {
      // Browser-native confirmation dialog — prevents accidental deletes
      const confirmed = window.confirm(
        "Are you sure you want to delete this student?"
      )
      if (!confirmed) return

      api.delete(`/students/${id}/`)
        .then(() => {
          // Remove the student from the local list
          this.students = this.students.filter((s) => s.id !== id)
          window.alert("Student deleted successfully")
          // OPTIONAL: uncomment to re-sync with the server
          // this.getStudents()
        })
        .catch((error) => {
          console.error("Error deleting student:", error)
          window.alert("Failed to delete student")
        })
    },
  },
}
</script>

<style scoped>
/* ---- Page layout ---- */
.students-page {
  padding: 20px;
}

.error-banner {
  padding: 12px 16px;
  background: #fee;
  color: #b00;
  border: 1px solid #fcc;
  border-radius: 4px;
  margin-bottom: 16px;
}

.loading,
.empty {
  padding: 10px 4px;
  color: #555;
}

.add-btn-inline {
  margin-left: 8px;
  padding: 4px 10px;
  background: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* ---- Cards grid ---- */
.cards {
  display: flex;
  gap: 20px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.card {
  width: 30%;
  min-width: 240px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f2f2f2;
}

.card_header {
  margin-bottom: 20px;
}

.card_header a {
  color: inherit;
  text-decoration: none;
}

.card_header a:hover {
  text-decoration: underline;
}

.card_body {
  margin-bottom: 20px;
}

.card_body p {
  margin-bottom: 10px;
}

/* ---- Action buttons ---- */
.action_btn {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.15s ease;
}

.btn:hover {
  filter: brightness(0.95);
}

.btn-modify {
  background-color: #f6e473;
}

.btn-delete {
  background-color: #f67379;
}
</style>
