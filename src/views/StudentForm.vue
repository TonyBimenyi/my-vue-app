<template>
  <!-- ================================================================
       STUDENT FORM — used for BOTH "Add" and "Edit" modes
       ================================================================
       Route `/students/add`       → isEditing = false → POST a new student
       Route `/students/edit/:id`  → isEditing = true  → PUT an existing one
       The component auto-detects mode by checking if :id exists in the URL.
    -->
  <div class="form-container">

    <!-- Dynamic heading based on add/edit mode -->
    <h1>{{ isEditing ? "Edit student" : "Add student" }}</h1>

    <!-- Inline error banner -->
    <div v-if="apiError" class="error-banner">
      {{ apiError }}
    </div>

    <!--
      @submit.prevent stops the browser's default full-page submit so we
      can handle the submission via JS (our `submitForm` method).
    -->
    <form @submit.prevent="submitForm" novalidate>

      <!-- ===== NAME field ===== -->
      <label for="name">Student name</label>
      <input
        v-model="form.name"
        type="text"
        id="name"
        name="name"
        placeholder="Enter student name"
        :disabled="loading"
      >
      <p v-if="errors.name" class="field-error">{{ errors.name }}</p>

      <!-- ===== COURSE field ===== -->
      <label for="course">Course</label>
      <select
        v-model="form.course"
        id="course"
        name="course"
        :disabled="loading || coursesLoading"
      >
        <!-- Disabled empty option = "placeholder" for the select -->
        <option value="" disabled>Select course</option>

        <!--
          Options are dynamically populated from GET /api/courses/.
          We try a few common field names for maximum backend flexibility:
            • course.id     → :value   (foreign key sent to the backend)
            • course.name | course.title | course  → label shown to user
        -->
        <option
          v-for="course in courses"
          :key="course.id"
          :value="course.id"
        >
          {{ course.course_name ?? course.title }}
        </option>
      </select>
      <p v-if="coursesLoading" class="field-info">Loading courses…</p>
      <p v-else-if="courses.length === 0" class="field-info info-warn">
        No courses found.  Create some on the backend first.
      </p>
      <p v-if="errors.course" class="field-error">{{ errors.course }}</p>

      <!-- ===== AGE field ===== -->
      <label for="age">Age</label>
      <input
        v-model="form.age"
        type="number"
        id="age"
        name="age"
        min="1"
        max="120"
        placeholder="Enter student age"
        :disabled="loading"
      >
      <p v-if="errors.age" class="field-error">{{ errors.age }}</p>

      <!-- ===== SUBMIT button ===== -->
      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading
          ? "Saving..."
          : (isEditing ? "Update" : "Add student")
        }}
      </button>

      <!-- Cancel / go back link -->
      <button
        type="button"
        class="cancel-btn"
        :disabled="loading"
        @click="$router.push('/students')"
      >
        Cancel
      </button>

    </form>
  </div>
</template>

<script>
// Shared axios instance — every API call below goes through it.
import api from "../services/api"

export default {
  name: "StudentForm",

  // ----------------------------------------------------------------
  // REACTIVE DATA
  // ----------------------------------------------------------------
  data() {
    return {
      // Two-way-bound form state (v-model).  Empty = create mode.
      form: {
        name: "",
        course: "",
        age: "",
      },

      // ------------------------------------------------------------------
      // COURSE LIST — dynamically fetched from GET /api/courses/
      // ------------------------------------------------------------------
      // These populate the <select> dropdown so it always matches the
      // backend's real Course table, instead of hardcoded IDs.
      courses: [],             // Array of course objects [{id, name}, ...]
      coursesLoading: false,   // true while the API call is in flight

      // Field-level validation error messages (keyed by field name).
      // Populated by `validateForm()`.
      errors: {},

      // Non-field API error message (e.g. 500 from backend).
      apiError: "",

      // True when URL contained `:id` → we're editing, not creating.
      isEditing: false,

      // ID of student being edited (only used when isEditing=true).
      studentId: null,

      // True while a network call is in flight → disables inputs & buttons.
      loading: false,
    }
  },

  // ----------------------------------------------------------------
  // LIFECYCLE HOOK
  // ----------------------------------------------------------------
  // Runs once the component is rendered. Always fetches the course
  // list first (needed for both ADD and EDIT modes). If `:id` exists
  // in the URL, also starts the edit-mode student fetch.
  mounted() {
    this.getCourses()

    const id = this.$route.params.id
    if (id) {
      this.isEditing = true
      this.studentId = id
      this.getStudent()
    }
  },

  // ----------------------------------------------------------------
  // METHODS
  // ----------------------------------------------------------------
  methods: {

    /**
     * Fetch the list of courses to populate the Course <select> dropdown.
     * Endpoint: GET /api/courses/
     * Handles both raw arrays and DRF-style paginated wrappers
     * (`{ results: [...] }`).
     */
    getCourses() {
      this.coursesLoading = true
      api.get("/courses/")
        .then((response) => {
          const data = response.data
          this.courses = Array.isArray(data) ? data : data.results
          console.log("Courses loaded:", this.courses)
        })
        .catch((error) => {
          console.error("Error loading courses:", error.message)
          if (error.response) {
            console.error("Courses status:", error.response.status)
            console.error("Courses data:", error.response.data)
          }
        })
        .finally(() => {
          this.coursesLoading = false
        })
    },

    /**
     * Fetch an existing student's data to pre-fill the edit form.
     * Endpoint: GET /api/students/<id>/
     */
    getStudent() {
      this.loading = true
      this.apiError = ""

      api.get(`/students/${this.studentId}/`)
        .then((response) => {
          const student = response.data
          console.log("Student received:", student)

          // Only copy the fields our form cares about. This avoids
          // accidentally pulling in extra keys or read-only fields.
          this.form = {
            name: student.name,
            age: student.age,
            // `course` might be a nested object {id, name} or just an
            // integer ID depending on the backend.  We normalize to ID.
            course: typeof student.course === "object"
              ? student.course.id
              : student.course,
          }
        })
        .catch((error) => {
          console.error(
            "Error loading student:",
            error.response?.data || error.message
          )
          this.apiError = "Could not load student data."
          window.alert("Failed to load student.")
          // Kick the user back to the list view
          this.$router.push("/students")
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * Client-side validation before hitting the backend.
     * Populates `this.errors` and returns true if all fields are valid.
     *
     * NOTE: this is just a UX convenience — the real validation MUST
     *       happen on the backend.  Never trust the client.
     */
    validateForm() {
      this.errors = {}

      if (!this.form.name || !this.form.name.trim()) {
        this.errors.name = "Please enter a name"
      }
      if (!this.form.course) {
        this.errors.course = "Please select a course"
      }
      const age = Number(this.form.age)
      if (!age || age < 1 || age > 120) {
        this.errors.age = "Please enter a valid age (1–120)"
      }

      return Object.keys(this.errors).length === 0
    },

    /**
     * Form submit handler — runs after `validateForm` passes.
     * Decides whether to POST (create) or PUT (update) based on mode.
     */
    submitForm() {
      this.apiError = ""

      if (!this.validateForm()) return

      // Build the final payload.  We coerce types to match what the
      // backend expects (course & age are ints, not strings).
      const studentData = {
        name: this.form.name.trim(),
        course: Number(this.form.course),
        age: Number(this.form.age),
      }

      console.log("Sending to backend:", studentData)
      this.loading = true

      if (this.isEditing) {
        this.updateStudent(studentData)
      } else {
        this.addStudent(studentData)
      }
    },

    /**
     * Create a new student.
     * Endpoint: POST /api/students/
     */
    addStudent(studentData) {
      api.post("/students/", studentData)
        .then((response) => {
          console.log("Created:", response.data)
          window.alert("Student added successfully.")
          this.$router.push("/students")
        })
        .catch((error) => {
          this.handleSaveError(error, "adding")
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * Update an existing student.
     * Endpoint: PUT /api/students/<id>/
     */
    updateStudent(studentData) {
      api.put(`/students/${this.studentId}/`, studentData)
        .then((response) => {
          console.log("Updated:", response.data)
          window.alert("Student updated successfully.")
          this.$router.push("/students")
        })
        .catch((error) => {
          this.handleSaveError(error, "updating")
        })
        .finally(() => {
          this.loading = false
        })
    },

    /**
     * Shared error handler for POST / PUT failures.
     * Tries to surface field-level errors returned by the backend
     * (e.g. DRF-style `{name: ["This field is required"]}`) into
     * `this.errors` so they show up next to the correct input.
     */
    handleSaveError(error, action /* "adding" | "updating" */) {
      console.error(
        `Error ${action} student:`,
        error.response?.data || error.message
      )

      if (error.response?.data && typeof error.response.data === "object") {
        // --- Try to map backend field errors to our form ---
        for (const [field, messages] of Object.entries(error.response.data)) {
          if (field in this.form) {
            // messages might be a string or an array of strings
            this.errors[field] = Array.isArray(messages)
              ? messages.join(" ")
              : String(messages)
          } else if (field === "detail" || field === "non_field_errors") {
            // Non-field API-level error
            this.apiError = Array.isArray(messages)
              ? messages.join(" ")
              : String(messages)
          }
        }
      }

      if (!this.apiError && Object.keys(this.errors).length === 0) {
        // No field errors found → fall back to a generic banner
        this.apiError = `Failed to ${action} student. Please try again.`
      }

      window.alert(this.apiError || `Failed to ${action} student.`)
    },
  },
}
</script>

<style scoped>
.form-container {
  max-width: 500px;
  margin: 24px auto;
  padding: 24px 28px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.form-container h1 {
  margin-top: 0;
  margin-bottom: 20px;
}

.error-banner {
  padding: 10px 14px;
  background: #fee;
  color: #b00;
  border: 1px solid #fcc;
  border-radius: 4px;
  margin-bottom: 16px;
}

label {
  display: block;
  margin: 14px 0 6px;
  font-weight: 600;
}

input[type="text"],
input[type="number"],
select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

input:disabled,
select:disabled,
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.field-error {
  color: #c33;
  margin: 4px 0 0;
  font-size: 13px;
}

.field-info {
  margin: 4px 0 0;
  font-size: 13px;
  color: #555;
}

.field-info.info-warn {
  color: #b36b00;
}

.submit-btn,
.cancel-btn {
  margin-top: 24px;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid #ccc;
  margin-right: 10px;
}

.submit-btn {
  background: #4a90e2;
  color: #fff;
  border-color: #4a90e2;
}

.submit-btn:hover:not(:disabled) {
  background: #3b7acb;
}

.cancel-btn {
  background: #f2f2f2;
  color: #333;
}

.cancel-btn:hover:not(:disabled) {
  background: #e5e5e5;
}
</style>
