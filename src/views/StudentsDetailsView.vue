<template>
  <!-- ================================================================
       STUDENT DETAIL VIEW
       ================================================================
       Route: `/students/:id`
       Loads a single student's full record from the API and renders it.
       Also provides quick actions (Edit / Delete / Back to list).
    -->
  <div class="details-page">

    <!-- Error banner -->
    <div v-if="error" class="error-banner">{{ error }}</div>

    <!-- Loading state -->
    <p v-if="loading" class="loading">Loading student details…</p>

    <!-- Empty / not found -->
    <p v-else-if="!student" class="empty">No student data available.</p>

    <!-- Actual student details -->
    <div v-else class="detail-card">
      <h1>{{ student.name }}</h1>

      <dl class="detail-list">
        <dt>ID</dt>
        <dd>{{ student.id }}</dd>

        <dt>Course</dt>
        <!--
          Flexible course rendering — works whether the backend sends
          a plain ID (2), a string name, or a nested object {id, name}.
        -->
        <dd>
          {{
            (typeof student.course === "object" && student.course?.name)
              ?? student.course_name
              ?? student.course
          }}
        </dd>

        <dt>Age</dt>
        <dd>{{ student.age }}</dd>

        <!-- If your backend returns extra fields (e.g. email, created_at),
             add more <dt>/<dd> pairs here. -->
      </dl>

      <!-- Action buttons -->
      <div class="actions">
        <button class="btn btn-back" @click="$router.push('/students')">
          ← Back to list
        </button>
        <button
          class="btn btn-edit"
          @click="$router.push(`/students/edit/${student.id}`)"
        >
          Edit
        </button>
        <button class="btn btn-delete" @click="deleteStudent">
          Delete
        </button>
      </div>
    </div>

  </div>
</template>

<script>
// Shared axios instance
import api from "../services/api"

export default {
  name: "StudentDetailsView",

  data() {
    return {
      student: null,  // Student object populated from the API
      loading: false,
      error: "",
    }
  },

  // ----------------------------------------------------------------
  // COMPUTED: studentId from the URL
  // ----------------------------------------------------------------
  // A computed is handy here because it's reactive — if the route
  // param ever changes (e.g. navigating from /students/1 to /students/2
  // without remounting the component), the value updates automatically.
  computed: {
    studentId() {
      return this.$route.params.id
    },
  },

  // ----------------------------------------------------------------
  // LIFECYCLE: fetch data on mount + when :id param changes
  // ----------------------------------------------------------------
  mounted() {
    this.loadStudent()
  },

  // `watch` re-fetches if navigating between detail pages without
  // a remount (Vue Router reuses components by default).
  watch: {
    studentId() {
      this.loadStudent()
    },
  },

  methods: {

    /**
     * Fetch a single student's details.
     * Endpoint: GET /api/students/<id>/
     */
    loadStudent() {
      if (!this.studentId) return

      this.loading = true
      this.error = ""
      this.student = null

      api.get(`/students/${this.studentId}/`)
        .then((response) => {
          this.student = response.data
        })
        .catch((error) => {
          console.error("Error loading student details:", error.message)
          if (error.response?.status === 404) {
            this.error = "Student not found (404)."
          } else {
            this.error = `Failed to load student: ${error.message}`
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * Delete this student and go back to the list view.
     * Endpoint: DELETE /api/students/<id>/
     */
    deleteStudent() {
      const confirmed = window.confirm(
        `Delete "${this.student.name}"? This cannot be undone.`
      )
      if (!confirmed) return

      this.loading = true
      api.delete(`/students/${this.studentId}/`)
        .then(() => {
          window.alert("Student deleted.")
          this.$router.push("/students")
        })
        .catch((error) => {
          console.error("Delete failed:", error)
          this.error = "Failed to delete student."
          window.alert("Failed to delete student.")
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped>
.details-page {
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

.detail-card {
  max-width: 600px;
  padding: 24px 28px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fafafa;
}

.detail-card h1 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 10px;
}

.detail-list {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 10px 16px;
  margin: 0 0 24px;
}

.detail-list dt {
  font-weight: 700;
  color: #555;
}

.detail-list dd {
  margin: 0;
}

.actions {
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

.btn:hover:not(:disabled) {
  filter: brightness(0.95);
}

.btn-back {
  background: #f2f2f2;
}

.btn-edit {
  background: #f6e473;
}

.btn-delete {
  background: #f67379;
}
</style>
